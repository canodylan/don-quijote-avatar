<div align="center">

# 🏰 Don Quijote Interactivo 🐴

**Avatar parlante de Don Quijote para el aula de infantil**

*Aplicación web 100% offline — sin instalación, sin servidor, sin internet*

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](index.html)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](style.css)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](script.js)

</div>

---

## ✨ ¿Qué es?

Una aplicación educativa pensada para **maestras de infantil** que muestra un avatar animado de Don Quijote capaz de hablar cualquier texto usando la síntesis de voz del navegador.

> 🎯 **Caso de uso:** Presentaciones en clase, oposiciones, actividades temáticas sobre literatura española.

---

## 🚀 Características

| Característica | Descripción |
|---|---|
| 🗣️ **Text-to-Speech** | Habla cualquier texto con voz del sistema |
| 🎙️ **Selector de voz** | Elige entre todas las voces disponibles en tu navegador |
| 👄 **Animación de boca** | Alterna 3 frames simulando que habla |
| 😌 **Parpadeo idle** | Pestañea automáticamente cuando no habla |
| ⚡ **Frases rápidas** | Botones con frases predefinidas para infantil |
| 🐢🐇 **Control de velocidad** | Slider para ajustar el ritmo del habla |
| 🔲 **Pantalla completa** | Modo presentación a un clic |
| 🎨 **Diseño infantil** | Colores suaves, nubes animadas, botones cartoon |
| 📱 **Responsive** | Funciona en tablets y pantallas pequeñas |
| 🔌 **100% Offline** | Abre `index.html` y listo, sin servidor |

---

## 📂 Estructura del proyecto

```
don-quijote-avatar/
│
├── index.html          ← Página principal (abrir aquí)
├── style.css           ← Estilos con tema infantil
├── script.js           ← Lógica de voz y animación
├── README.md
│
└── img/
    ├── quijote_idle.jpeg            ← Boca cerrada (reposo)
    ├── quijote_semi_open_mouth2.jpg ← Boca semiabierta
    ├── quijote_open_mouth2.jpg      ← Boca abierta
    └── quijote_blinking2.jpg        ← Ojos cerrados (parpadeo)
```

---

## 🎬 Cómo usar

1. **Descarga o clona** este repositorio
2. **Abre `index.html`** en tu navegador (Chrome recomendado)
3. ¡Listo! No necesitas instalar nada

### Pasos en la app

| Paso | Acción |
|:---:|---|
| 1️⃣ | Escribe un texto o pulsa una **frase rápida** |
| 2️⃣ | Elige la **voz** que prefieras en el selector |
| 3️⃣ | Ajusta la **velocidad** con el slider 🐢↔🐇 |
| 4️⃣ | Pulsa **¡Hablar!** y Don Quijote cobrará vida |
| 5️⃣ | Usa **Pantalla completa** para presentaciones |

---

## 🛠️ Tecnologías

- **HTML5** — Estructura semántica
- **CSS3** — Animaciones, nubes y diseño responsive
- **JavaScript Vanilla** — Sin frameworks ni dependencias
- **Web Speech API** — `speechSynthesis` nativo del navegador

> ⚠️ No requiere Node.js, npm, ni ningún servidor.

---

## 🎨 Personalización

### Cambiar las imágenes del avatar

Reemplaza los archivos en `img/` manteniendo las mismas dimensiones. Las 4 imágenes deben tener el **mismo tamaño** para evitar saltos en la animación.

### Añadir más frases rápidas

En `index.html`, duplica un botón dentro de `.quick-phrases__grid`:

```html
<button class="btn btn-quick" data-phrase="Tu frase aquí">
  🌟 Tu frase aquí
</button>
```

---

## 💡 Consejos

- Usa **Google Chrome** para la mejor compatibilidad de voces
- La voz **"Google español"** suena natural y clara para niños
- En modo presentación, los controles quedan accesibles abajo

---

## 📜 Licencia

Proyecto educativo de uso libre. Creado con ❤️ para las aulas de infantil.

---

<div align="center">

*«En un lugar de la Mancha, de cuyo nombre no quiero acordarme...»*

**🏰 ¡Buena suerte en las oposiciones! 🍀**

</div>
