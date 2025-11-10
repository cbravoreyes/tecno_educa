import type { Level, PlayerState } from './types';

export const GAME_CONFIG = {
    width: 800,
    height: 600,
    gravity: 0.6,
    playerSpeed: 5,
    jumpStrength: 15,
    playerSize: { width: 30, height: 40 },
    platformHeight: 20,
    collectibleSize: { width: 25, height: 25 },
    enemySizes: {
        rock: { width: 40, height: 40 },
        ghost: { width: 30, height: 40 },
        gear: { width: 35, height: 35 },
        steam: { width: 30, height: 50 },
        glitch: { width: 25, height: 25 },
        firewall: { width: 50, height: 20 },
    },
    initialPlayerState: {
        x: 100,
        y: 400,
        vx: 0,
        vy: 0,
        onGround: false,
        lives: 3,
        score: 0,
    } as PlayerState,
};

export const LEVELS: Level[] = [
    {
        name: "Edad de Piedra del Aprendizaje",
        backgroundColor: "#6B4F35", // Brown
        startPos: { x: 50, y: 520 },
        summary: "En la prehistoria, el conocimiento se transmitía a través de pinturas en cuevas y tablillas de arcilla. La enseñanza era directa y visual, sentando las bases de la comunicación simbólica.",
        platforms: [
            { x: 0, y: 580, width: 800, height: GAME_CONFIG.platformHeight },
            { x: 200, y: 480, width: 150, height: GAME_CONFIG.platformHeight },
            { x: 450, y: 380, width: 200, height: GAME_CONFIG.platformHeight },
            { x: 100, y: 280, width: 100, height: GAME_CONFIG.platformHeight },
            { x: 650, y: 200, width: 150, height: GAME_CONFIG.platformHeight },
        ],
        collectibles: [
            { x: 250, y: 440, name: "Tablilla de arcilla", fact: "Las tablillas cuneiformes fueron uno de los primeros medios para registrar leyes, comercio e historias.", color: "bg-yellow-800" },
            { x: 500, y: 340, name: "Pintura Rupestre", fact: "Las pinturas en cuevas eran enciclopedias visuales que enseñaban técnicas de caza y rituales a las nuevas generaciones.", color: "bg-red-900" },
        ],
        enemies: [
            { x: 480, y: 0, type: 'rock', movement: 'fall' },
            { x: 150, y: -200, type: 'rock', movement: 'fall' },
        ]
    },
    {
        name: "Mundo de los Manuscritos",
        backgroundColor: "#4A5568", // Gray-Blue
        startPos: { x: 50, y: 520 },
        summary: "Durante la Edad Media, los monjes copistas preservaron el saber en pergaminos. La educación era un privilegio para pocos, centrada en monasterios y universidades emergentes.",
        platforms: [
            { x: 0, y: 580, width: 800, height: GAME_CONFIG.platformHeight },
            { x: 150, y: 500, width: 120, height: GAME_CONFIG.platformHeight },
            { x: 350, y: 420, width: 180, height: GAME_CONFIG.platformHeight },
            { x: 600, y: 350, width: 150, height: GAME_CONFIG.platformHeight },
            { x: 400, y: 250, width: 100, height: GAME_CONFIG.platformHeight },
            { x: 100, y: 180, width: 130, height: GAME_CONFIG.platformHeight },
        ],
        collectibles: [
            { x: 400, y: 380, name: "Pergamino", fact: "Hechos de piel de animal, los pergaminos eran duraderos pero costosos, limitando la difusión del conocimiento.", color: "bg-yellow-200" },
            { x: 150, y: 140, name: "Pluma de Ave", fact: "La pluma fue la herramienta de escritura dominante durante siglos, permitiendo la creación de textos detallados.", color: "bg-gray-300" },
        ],
        enemies: [
             { x: 360, y: 380, type: 'ghost', movement: 'patrol', patrolRange: [350, 500] },
             { x: 610, y: 310, type: 'ghost', movement: 'patrol', patrolRange: [600, 720] },
        ]
    },
    {
        name: "Era de la Imprenta",
        backgroundColor: "#2C5282", // Dark Blue
        startPos: { x: 700, y: 100 },
        summary: "La invención de la imprenta de Gutenberg en el siglo XV democratizó el conocimiento. Los libros se volvieron accesibles, impulsando la Reforma, el Renacimiento y la alfabetización masiva.",
        platforms: [
            { x: 0, y: 580, width: 800, height: GAME_CONFIG.platformHeight },
            { x: 600, y: 480, width: 200, height: GAME_CONFIG.platformHeight },
            { x: 300, y: 400, width: 250, height: GAME_CONFIG.platformHeight },
            { x: 50, y: 320, width: 200, height: GAME_CONFIG.platformHeight },
            { x: 400, y: 240, width: 180, height: GAME_CONFIG.platformHeight },
            { x: 650, y: 160, width: 150, height: GAME_CONFIG.platformHeight },
        ],
        collectibles: [
            { x: 350, y: 360, name: "Libro Impreso", fact: "El libro impreso permitió la reproducción idéntica y masiva de textos, estandarizando el saber.", color: "bg-red-700" },
            { x: 100, y: 280, name: "Prensa Mecánica", fact: "La prensa de tipos móviles redujo drásticamente el costo y tiempo de producción de libros.", color: "bg-gray-500" },
        ],
        enemies: [
            { x: 310, y: 365, type: 'gear', movement: 'patrol', patrolRange: [300, 515] },
            { x: 70, y: 285, type: 'gear', movement: 'patrol', patrolRange: [50, 215] },
        ]
    },
    {
        name: "Revolución Industrial Educativa",
        backgroundColor: "#5A67D8", // Indigo
        startPos: { x: 50, y: 100 },
        summary: "La Revolución Industrial trajo la educación pública y herramientas como la pizarra y la máquina de escribir. La enseñanza se estandarizó para preparar a la fuerza laboral industrial.",
        platforms: [
            { x: 0, y: 580, width: 800, height: GAME_CONFIG.platformHeight },
            { x: 100, y: 480, width: 150, height: GAME_CONFIG.platformHeight },
            { x: 350, y: 400, width: 150, height: GAME_CONFIG.platformHeight },
            { x: 600, y: 320, width: 150, height: GAME_CONFIG.platformHeight },
            { x: 350, y: 240, width: 150, height: GAME_CONFIG.platformHeight },
            { x: 50, y: 160, width: 150, height: GAME_CONFIG.platformHeight },
        ],
        collectibles: [
            { x: 400, y: 360, name: "Pizarra", fact: "La pizarra permitió a los maestros presentar información a toda una clase simultáneamente, masificando la instrucción.", color: "bg-gray-800" },
            { x: 650, y: 280, name: "Máquina de Escribir", fact: "Introdujo la mecanografía y la producción rápida de documentos estandarizados en la educación y oficinas.", color: "bg-gray-400" },
        ],
        enemies: [
             { x: 150, y: 430, type: 'steam', movement: 'static' },
             { x: 380, y: 350, type: 'steam', movement: 'static' },
             { x: 80, y: 110, type: 'steam', movement: 'static' },
        ]
    },
    {
        name: "Mundo Digital",
        backgroundColor: "#2D3748", // Dark Gray
        startPos: { x: 375, y: 100 },
        summary: "El siglo XX trajo las computadoras y proyectores, personalizando el aprendizaje. El acceso a la información se volvió instantáneo, cambiando el rol del maestro de transmisor a guía.",
        platforms: [
            { x: 0, y: 580, width: 150, height: GAME_CONFIG.platformHeight },
            { x: 650, y: 580, width: 150, height: GAME_CONFIG.platformHeight },
            { x: 200, y: 480, width: 100, height: GAME_CONFIG.platformHeight },
            { x: 500, y: 480, width: 100, height: GAME_CONFIG.platformHeight },
            { x: 350, y: 380, width: 100, height: GAME_CONFIG.platformHeight },
            { x: 100, y: 280, width: 100, height: GAME_CONFIG.platformHeight },
            { x: 600, y: 280, width: 100, height: GAME_CONFIG.platformHeight },
            { x: 350, y: 160, width: 100, height: GAME_CONFIG.platformHeight },
        ],
        collectibles: [
            { x: 130, y: 240, name: "Computadora", fact: "La PC personal trajo el software educativo y el acceso a Internet a las aulas y hogares.", color: "bg-blue-300" },
            { x: 630, y: 240, name: "Tablet", fact: "Las tablets ofrecen portabilidad y acceso a miles de apps educativas, fomentando el aprendizaje interactivo y móvil.", color: "bg-white" },
        ],
        enemies: [
            { x: 50, y: 540, type: 'glitch', movement: 'teleport' },
            { x: 700, y: 540, type: 'glitch', movement: 'teleport' },
        ]
    },
     {
        name: "Era de la Inteligencia Artificial",
        backgroundColor: "#1A202C", // Almost Black
        startPos: { x: 50, y: 520 },
        summary: "Hoy, la IA y las aulas virtuales personalizan la educación a una escala sin precedentes. Los sistemas adaptativos y los tutores virtuales prometen una enseñanza a la medida de cada estudiante.",
        platforms: [
            { x: 0, y: 580, width: 800, height: GAME_CONFIG.platformHeight },
            { x: 150, y: 500, width: 100, height: GAME_CONFIG.platformHeight },
            { x: 300, y: 420, width: 100, height: GAME_CONFIG.platformHeight },
            { x: 450, y: 340, width: 100, height: GAME_CONFIG.platformHeight },
            { x: 600, y: 260, width: 100, height: GAME_CONFIG.platformHeight },
            { x: 400, y: 180, width: 100, height: GAME_CONFIG.platformHeight },
            { x: 200, y: 100, width: 100, height: GAME_CONFIG.platformHeight },
        ],
        collectibles: [
            { x: 480, y: 300, name: "Robot Tutor", fact: "Los robots y la IA pueden ofrecer tutoría personalizada y asistencia a los estudiantes 24/7.", color: "bg-teal-400" },
            { x: 230, y: 60, name: "Chip IA", fact: "Los chips de IA procesan datos para crear rutas de aprendizaje adaptativas, ajustándose al ritmo y estilo de cada alumno.", color: "bg-purple-500" },
        ],
        enemies: [
            { x: 300, y: 400, type: 'firewall', movement: 'patrol', patrolRange: [300, 350]},
            { x: 600, y: 240, type: 'firewall', movement: 'patrol', patrolRange: [600, 650]},
            { x: 200, y: 80, type: 'firewall', movement: 'patrol', patrolRange: [200, 250]},
        ]
    },
];
