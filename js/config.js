// js/config.js
export const CONFIG = {
    // Colors
    colors: {
        primary: 0xff4d6d,
        secondary: 0x4361ee,
        accent: 0x7209b7,
        highlight: 0xf9c74f,
        dark: 0x0a0a0f,
        light: 0xffffff
    },
    
    // Camera settings
    camera: {
        fov: 45,
        near: 0.1,
        far: 1000,
        initialPosition: { x: 5, y: 3, z: 10 },
        initialTarget: { x: 0, y: 0, z: 0 }
    },
    
    // Scene settings
    scene: {
        backgroundColor: 0x0a0a0f,
        fogColor: 0x0a0a0f,
        fogDensity: 0.002
    },
    
    // Section positions (where camera moves)
    sections: {
        hero: { x: 0, y: 1, z: 12, targetX: 0, targetY: 1, targetZ: 0 },
        skills: { x: -8, y: 2, z: 8, targetX: -4, targetY: 1, targetZ: 0 },
        projects: { x: 8, y: 2, z: 8, targetX: 4, targetY: 1, targetZ: 0 },
        certifications: { x: -5, y: 3, z: 15, targetX: -3, targetY: 1, targetZ: -3 },
        contact: { x: 5, y: 2, z: 12, targetX: 3, targetY: 1, targetZ: -2 }
    },
    
    // Animation durations
    animations: {
        cameraMove: 1.5,
        fadeIn: 1,
        rotationSpeed: 0.002
    },
    
    // Content data
    content: {
        name: "Neelkumar Patel",
        title: "Computer Engineering Student",
        email: "2403396160351@paruluniversity.ac.in",
        phone: "+91 9023030288",
        location: "Vadodara",
        github: "https://github.com/neelkumar-patel", // Update this
        
        skills: {
            frontend: ["HTML5", "CSS3", "JavaScript", "SCSS"],
            backend: ["Python", "C++", "PHP", "APIs"],
            database: ["DBMS"],
            networking: ["Computer Networking", "OS Basics", "Hardware Basics"],
            tools: ["Blender 3D", "Figma"],
            os: ["Operating Systems", "Computer Architecture"]
        },
        
        projects: [
            {
                id: "windows8",
                title: "Windows Web 8",
                description: "The modified version of kishlaya's project... Windows 8 in a browser. Features boot screen, login screen, desktop, start menu, apps and complete real-time experience.",
                tech: ["HTML5", "CSS3", "SASS", "jQuery"],
                color: 0x00a1f1,
                live: "#",
                github: "#",
                date: "Jan 2026 - Mar 2026"
            },
            {
                id: "macos",
                title: "macOS Web Emulator",
                description: "macOS NX is a fully functional, web-based clone of the macOS desktop environment, built from scratch using only vanilla HTML, CSS, and JavaScript. Features draggable windows, dynamic dock, and built-in apps.",
                tech: ["HTML5", "CSS3", "JavaScript"],
                color: 0xffffff,
                live: "#",
                github: "#",
                date: "Jan 2026 - Present"
            },
            {
                id: "sound",
                title: "Machine Sound Diagnostics",
                description: "Machine fault detection system that analyzes sound recordings. Python-based ML backend with Android app that sends WAV files for analysis.",
                tech: ["Python", "Android", "ML", "APIs"],
                color: 0x7209b7,
                live: "#",
                github: "#",
                date: "2025 - Present"
            }
        ],
        
        certifications: [
            {
                id: "networking",
                title: "Computer Networking",
                issuer: "Cisco Networking Academy",
                date: "Jan 2026",
                description: "Completed Networking Basics training, covering network communication, IP addressing, Ethernet, routers, wireless configuration, and troubleshooting.",
                color: 0x00b8ff
            },
            {
                id: "hardware",
                title: "Computer Hardware Basics",
                issuer: "Cisco Networking Academy",
                date: "Apr 2025",
                description: "Fundamental knowledge of computer components, assembly, maintenance, and troubleshooting.",
                color: 0xff4d6d
            },
            {
                id: "os",
                title: "Operating System Basics",
                issuer: "Cisco Networking Academy",
                date: "Aug 2025",
                description: "Fundamental concepts of operating systems including installation, configuration, file systems, directory structures, and system management.",
                color: 0x4361ee
            }
        ],
        
        extracurricular: [
            {
                title: "Hackathon Team Leader",
                description: "Led team of 4 members for personal projects in college hackathon events (3 times)",
                icon: "🏆"
            }
        ],
        
        education: {
            degree: "Polytechnic Diploma in Computer Engineering",
            institution: "Parul Institute Of Engg. And Tech",
            duration: "2024 - Present"
        }
    }
};