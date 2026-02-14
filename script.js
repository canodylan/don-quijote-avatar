(() => {
  "use strict";

  const avatarImage = document.getElementById("avatarImage");
  const speechText = document.getElementById("speechText");
  const speakBtn = document.getElementById("speakBtn");
  const fullscreenBtn = document.getElementById("fullscreenBtn");
  const speedRange = document.getElementById("speedRange");
  const speedValue = document.getElementById("speedValue");
  const statusText = document.getElementById("statusText");
  const voiceSelect = document.getElementById("voiceSelect");
  const quickButtons = Array.from(document.querySelectorAll(".btn-quick"));
  const avatarPanel = document.querySelector(".avatar-panel");

  /* --- Imágenes del avatar --- */
  // Frames para la animación de boca al hablar (idle → semi → abierta)
  const avatarFrames = [
    "img/quijote_idle.jpeg",
    "img/quijote_semi_open_mouth2.jpg",
    "img/quijote_open_mouth2.jpg"
  ];
  // Frame de parpadeo (ojos cerrados) para la animación idle
  const BLINK_FRAME = "img/quijote_blinking2.jpg";

  const MOUTH_ANIMATION_INTERVAL_MS = 180;
  const IDLE_BLINK_MIN_MS = 4000;
  const IDLE_BLINK_MAX_MS = 6000;
  const IDLE_BLINK_DURATION_MS = 160;

  let selectedVoice = null;
  let isSpeaking = false;
  let mouthAnimationTimer = null;
  let mouthFrameIndex = 0;
  let idleBlinkTimeout = null;
  let speechEndPollTimer = null;   // Polling para detectar fin de habla antes que onend

  const isSpeechSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;

  function updateSpeedLabel() {
    speedValue.textContent = `${Number(speedRange.value).toFixed(1)}x`;
  }

  function setStatus(message) {
    statusText.textContent = message;
  }

  function setAvatarFrame(index) {
    avatarImage.src = avatarFrames[index];
  }

  /**
   * Polling rápido (cada 100 ms) que comprueba si speechSynthesis.speaking
   * ya es false. El evento onend del navegador suele llegar con ~500 ms de
   * retraso, así que este polling corta la animación de boca mucho antes.
   */
  function startSpeechEndPolling() {
    stopSpeechEndPolling();
    speechEndPollTimer = window.setInterval(() => {
      if (!window.speechSynthesis.speaking) {
        handleSpeechEnd();
      }
    }, 100);
  }

  function stopSpeechEndPolling() {
    if (speechEndPollTimer) {
      window.clearInterval(speechEndPollTimer);
      speechEndPollTimer = null;
    }
  }

  /** Acción centralizada de fin de habla (llamada por polling o por onend) */
  function handleSpeechEnd() {
    if (!isSpeaking) return; // Ya se procesó
    isSpeaking = false;
    stopSpeechEndPolling();
    avatarPanel.classList.remove("is-speaking");
    stopMouthAnimation();
    setStatus("¡Listo para otra aventura! 🗣️");
    scheduleIdleBlink();
  }

  function startMouthAnimation() {
    stopMouthAnimation();
    mouthFrameIndex = 0;

    mouthAnimationTimer = window.setInterval(() => {
      mouthFrameIndex = (mouthFrameIndex + 1) % avatarFrames.length;
      setAvatarFrame(mouthFrameIndex);
    }, MOUTH_ANIMATION_INTERVAL_MS);
  }

  function stopMouthAnimation() {
    if (mouthAnimationTimer) {
      window.clearInterval(mouthAnimationTimer);
      mouthAnimationTimer = null;
    }

    setAvatarFrame(0);
  }

  function clearIdleBlinkTimeout() {
    if (idleBlinkTimeout) {
      window.clearTimeout(idleBlinkTimeout);
      idleBlinkTimeout = null;
    }
  }

  function scheduleIdleBlink() {
    clearIdleBlinkTimeout();

    const randomDelay = Math.floor(
      IDLE_BLINK_MIN_MS + Math.random() * (IDLE_BLINK_MAX_MS - IDLE_BLINK_MIN_MS)
    );

    idleBlinkTimeout = window.setTimeout(() => {
      if (!isSpeaking) {
        // Mostrar imagen con ojos cerrados (parpadeo)
        avatarImage.src = BLINK_FRAME;
        window.setTimeout(() => {
          if (!isSpeaking) {
            setAvatarFrame(0); // Volver a idle (ojos abiertos)
          }
          scheduleIdleBlink();
        }, IDLE_BLINK_DURATION_MS);
      } else {
        scheduleIdleBlink();
      }
    }, randomDelay);
  }

  function getSpanishVoice(voices) {
    if (!voices || voices.length === 0) {
      return null;
    }

    const spanishVoices = voices.filter((voice) =>
      /(^es[-_]|spanish|español)/i.test(`${voice.lang} ${voice.name}`)
    );

    if (spanishVoices.length === 0) {
      return null;
    }

    const preferredPatterns = [
      /google\b.*\bes[-_]es/i,
      /google\b.*\bes[-_]/i,
      /female|woman|zira|helena|maria|elvira|sofia|isabel|lucia/i,
      /es[-_]es/i,
      /es[-_]mx|es[-_]ar|es[-_]co/i
    ];

    for (const pattern of preferredPatterns) {
      const match = spanishVoices.find((voice) => pattern.test(`${voice.name} ${voice.lang}`));
      if (match) {
        return match;
      }
    }

    return spanishVoices[0];
  }

  /**
   * Pobla el <select> con todas las voces disponibles.
   * Pre-selecciona automáticamente la mejor voz en español,
   * pero respeta si el usuario ya eligió una manualmente.
   */
  let userHasChosenVoice = false; // true cuando el usuario cambia el select

  function populateVoiceSelect() {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return;

    // Guardar valor previo (si el usuario ya eligió algo)
    const previousValue = voiceSelect.value;

    voiceSelect.innerHTML = "";

    voices.forEach((voice, index) => {
      const opt = document.createElement("option");
      opt.value = index;
      opt.textContent = `${voice.name} (${voice.lang})`;
      voiceSelect.appendChild(opt);
    });

    // Si el usuario ya eligió manualmente, intentar mantener su elección
    if (userHasChosenVoice && previousValue !== "") {
      voiceSelect.value = previousValue;
      selectedVoice = voices[Number(voiceSelect.value)] || null;
    } else {
      // Auto-seleccionar la mejor voz en español
      const best = getSpanishVoice(voices);
      if (best) {
        const bestIndex = voices.indexOf(best);
        voiceSelect.value = bestIndex;
        selectedVoice = best;
      } else {
        selectedVoice = voices[0] || null;
        voiceSelect.value = "0";
      }
    }
  }

  function updateVoiceSelection() {
    populateVoiceSelect();
  }

  function stopSpeakingIfNeeded() {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
  }

  function speakText(textToSpeak) {
    if (!isSpeechSupported) {
      setStatus("😢 Este navegador no puede hablar");
      return;
    }

    const text = textToSpeak.trim();
    if (!text) {
      setStatus("✏️ ¡Escribe algo primero!");
      speechText.focus();
      return;
    }

    stopSpeakingIfNeeded();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedVoice ? selectedVoice.lang : "es-ES";
    utterance.rate = Number(speedRange.value);

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      isSpeaking = true;
      avatarPanel.classList.add("is-speaking");
      setStatus("🗣️ ¡Don Quijote está hablando!");
      clearIdleBlinkTimeout();
      startMouthAnimation();
      startSpeechEndPolling(); // Polling rápido para cortar la boca cuanto antes
    };

    // onend llega con retraso; handleSpeechEnd es idempotente, así que no pasa nada
    // si el polling ya lo ejecutó antes.
    utterance.onend = () => {
      handleSpeechEnd();
    };

    utterance.onerror = () => {
      stopSpeechEndPolling();
      isSpeaking = false;
      avatarPanel.classList.remove("is-speaking");
      stopMouthAnimation();
      setStatus("😅 ¡Ups! No pude hablar, inténtalo de nuevo");
      scheduleIdleBlink();
    };

    window.speechSynthesis.speak(utterance);
  }

  function enterFullscreen() {
    const element = document.documentElement;
    if (document.fullscreenElement) {
      return;
    }

    if (element.requestFullscreen) {
      element.requestFullscreen().catch(() => {
        setStatus("🔲 No se pudo poner a pantalla completa");
      });
    }
  }

  function bindEvents() {
    speakBtn.addEventListener("click", () => {
      speakText(speechText.value);
    });

    speedRange.addEventListener("input", updateSpeedLabel);

    fullscreenBtn.addEventListener("click", enterFullscreen);

    // Cuando el usuario cambia la voz manualmente
    voiceSelect.addEventListener("change", () => {
      userHasChosenVoice = true;
      const voices = window.speechSynthesis.getVoices();
      const idx = Number(voiceSelect.value);
      selectedVoice = voices[idx] || null;
    });

    quickButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const phrase = button.getAttribute("data-phrase") || "";
        speechText.value = phrase;
        speakText(phrase);
      });
    });
  }

  function init() {
    updateSpeedLabel();

    if (!isSpeechSupported) {
      speakBtn.disabled = true;
      quickButtons.forEach((button) => {
        button.disabled = true;
      });
      setStatus("😢 Este navegador no puede hablar");
      return;
    }

    updateVoiceSelection();
    window.speechSynthesis.onvoiceschanged = updateVoiceSelection;

    if (!selectedVoice) {
      setStatus("🌍 No encontré voz en español, usaré otra");
    }

    bindEvents();
    scheduleIdleBlink();
  }

  init();
})();
