// firebase.js

const FIREBASE_BASE_URL = 'https://remotestorage-d19c5-default-rtdb.europe-west1.firebasedatabase.app';

/**
 * Holt die komplette "join"-Struktur aus der Realtime Database.
 */
async function fetchAllData() {
    const res = await fetch(`${FIREBASE_BASE_URL}/join.json`);
    if (!res.ok) {
        throw new Error('Fehler beim Laden der Daten: ' + res.status);
    }
    const data = await res.json();
    return data || {};
}

/**
 * Task in der DB speichern (Platzhalter – kannst du später ausfüllen)
 */
function addTaskToDB(task_title, task_description, task_due_date, task_priority, task_category, all_contacts, all_subtasks) {
    // TODO: Hier später echte Task-Speicherung einbauen
    console.log('addTaskToDB noch nicht implementiert');
}

/* ==========================
   USER / GUEST BACKEND-LOGIK
   ========================== */

/**
 * Holt alle User aus /join/users.
 */
async function getAllUsers() {
    const res = await fetch(`${FIREBASE_BASE_URL}/join/users.json`);
    if (!res.ok) {
        throw new Error('Fehler beim Laden der User: ' + res.status);
    }
    const data = await res.json();
    return data || {};
}

/**
 * Sucht einen User per E-Mail in /join/users.
 * Rückgabe: { id, ...user } oder null
 */
async function getUserByEmail(email) {
    const users = await getAllUsers();

    for (const userId in users) {
        const user = users[userId];
        if (user && user.email && user.email.toLowerCase() === email.toLowerCase()) {
            return { id: userId, ...user };
        }
    }

    return null;
}

/**
 * Legt einen neuen User in /join/users an.
 * ⚠️ Nur zu Lernzwecken: Passwort im Klartext!
 */
async function createUserInDB(name, email, password) {
    const newUser = {
        name,
        email,
        password, // in echten Projekten: niemals Klartext!
        role: 'user',
        createdAt: new Date().toISOString()
    };

    const res = await fetch(`${FIREBASE_BASE_URL}/join/users.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
    });

    if (!res.ok) {
        throw new Error('Fehler beim Erstellen des Users: ' + res.status);
    }

    const resData = await res.json();
    const id = resData.name; // Firebase generierte ID

    return { id, ...newUser };
}

/**
 * Legt einen Guest-User in der DB an.
 * Rückgabe: { id, name, email, role }
 */
async function createGuestUserInDB() {
    const guestUser = {
        name: 'Guest',
        email: 'guest@example.com',
        role: 'guest',
        createdAt: new Date().toISOString()
    };

    const res = await fetch(`${FIREBASE_BASE_URL}/join/users.json`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(guestUser)
    });

    if (!res.ok) {
        throw new Error('Fehler beim Erstellen des Guest-Users: ' + res.status);
    }

    const resData = await res.json();
    const id = resData.name; // Firebase gibt die generierte ID unter "name" zurück

    return { id, ...guestUser };
}

/**
 * Prüft, ob es bereits einen Guest-User gibt.
 * Wenn ja → diesen zurückgeben
 * Wenn nein → neuen Guest-User anlegen.
 */
async function getOrCreateGuestUser() {
    const users = await getAllUsers();

    // nach User mit role === 'guest' suchen
    for (const userId in users) {
        const user = users[userId];
        if (user && user.role === 'guest') {
            return {
                id: userId,
                ...user
            };
        }
    }

    // kein Guest vorhanden → neu anlegen
    return await createGuestUserInDB();
}
