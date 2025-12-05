const FIREBASE_BASE_URL = 'https://remotestorage-d19c5-default-rtdb.europe-west1.firebasedatabase.app';

async function fetchAllData() {
    const res = await fetch(`${FIREBASE_BASE_URL}/join.json`);
    if (!res.ok) {
        throw new Error('Fehler beim Laden der Daten: ' + res.status);
    }
    const data = await res.json();
    return data || {};
}

function addTaskToDB(task_title, task_description, task_due_date, task_priority, task_category, all_contacts, all_subtasks) {
   
    console.log('addTaskToDB noch nicht implementiert');
}

async function getAllUsers() {
    const res = await fetch(`${FIREBASE_BASE_URL}/join/users.json`);
    if (!res.ok) {
        throw new Error('Fehler beim Laden der User: ' + res.status);
    }
    const data = await res.json();
    return data || {};
}

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

async function createUserInDB(name, email, password) {
    const newUser = {
        name,
        email,
        password, 
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
    const id = resData.name;

    return { id, ...newUser };
}

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
    const id = resData.name; 

    return { id, ...guestUser };
}

async function getOrCreateGuestUser() {
    const users = await getAllUsers();

    for (const userId in users) {
        const user = users[userId];
        if (user && user.role === 'guest') {
            return {
                id: userId,
                ...user
            };
        }
    }
    
    return await createGuestUserInDB();
}
