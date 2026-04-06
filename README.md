# Prueba Técnica Frontend - World Trade Center Barcelona - Daba System

Este repositorio contiene la resolución de la prueba técnica para la maquetación de los módulos **Hero Desktop**, **SEO Desktop** y **SEO Mobile** del World Trade Center Barcelona.

El proyecto ha sido desarrollado con un enfoque **Pixel Perfect**, prestando especial atención a las animaciones de alto rendimiento (efecto cortina al hacer scroll, microinteracciones en botones) y cumpliendo **estrictamente** con el manual de maquetación proporcionado.

## Demo y Repositorio

**Deploy en vivo:** [https://dabasystem.vercel.app/](https://dabasystem.vercel.app/)

**Repositorio GitHub:** [https://github.com/papercri/Dabasystem.git](https://github.com/papercri/Dabasystem.git)

## Funcionalidades Implementadas

### Hero Desktop
- **Carrusel interactivo** con transición fade entre slides
- **Navegación con flechas** solo visible en desktop
- **Animaciones de entrada** con efectos wow
- **Responsive design** que se adapta perfectamente a móvil
- **Microinteracciones** en botones con efecto slide de texto

### SEO Desktop
- **Efecto cortina** avanzado al hacer scroll con máscara personalizada
- **Animaciones secuenciales** de texto y contenido
- **Transición suave** entre estados inicial y final
- **Layout grid** responsive para escritorio
- **Video de fondo** optimizado con filtros CSS

### SEO Mobile 
- **Texto rotativo interactivo** con "Impulsem" fijo y frases animadas
- **Barra de progreso por pasos** (25% por cada frase)
- **Control manual** mediante tap/click en la barra de progreso
- **Navegación mock** que aparece solo en la pantalla final

## Tecnologías y Librerías

* **HTML5:** Semántico y accesible
* **LESS / CSS3:** Preprocesador con variables, mixins y anidación
* **Vanilla JavaScript (ES6+):**
  - Intersection Observer API para detección de scroll
  - Animaciones de alto rendimiento sin librerías externas
  - Gestión de eventos táctiles para móvil
  - Control de estados de animación
* **SwiperJS (v10):** Carrusel del Hero con transiciones suaves
* **Font Awesome (v6):** Iconografía de controles de navegación


## Estructura del Proyecto

```text
├── index.html                  # Página principal con ambos módulos
├── media/                      # Assets multimedia
│   ├── desktop-slide1.jpg     # Slide 1 del carrusel
│   ├── desktop-slide2.jpg     # Slide 2 del carrusel
│   ├── seo-background.png     # Imagen de máscara SEO
│   └── seo-video.mp4          # Video de fondo SEO
├── css/
│   ├── funciones.less         # Variables y mixins LESS
│   ├── style.less             # Estilos fuente LESS
│   └── style.css              # CSS compilado
├── js/
│   └── main.js                # Lógica JavaScript
└── README.md                   # Documentación
```

## Características Técnicas Destacadas

- **Pixel Perfect**: Implementación fiel al diseño proporcionado
- **Alto Rendimiento**: Animaciones optimizadas usando CSS transforms y will-change
- **Mobile First**: Responsive design que se adapta a todos los dispositivos
- **Código Limpio**: JavaScript modular y semántico
- **Accesibilidad**: Estructura HTML semántica y navegación por teclado
- **Sin dependencias pesadas**: Solo librerías esenciales (SwiperJS)

---

**Desarrollado por**: Cristiana Sollini

**Para**: Daba System

**Proyecto**: World Trade Center Barcelona