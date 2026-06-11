// script.js
if (typeof lessonsData === 'undefined'){
    console.error("lessons.js لم يتم تحميله بشكل صحيح");}
    else {console.log("تم تحميل lessons.js بنجاح");}

// دوال مساعدة للتخزين المحلي
function getUsers() {
    let users = localStorage.getItem("users");
    return users ? JSON.parse(users) : {};
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// تسجيل حساب جديد
window.register = function() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let msg = document.getElementById("msg");
    if (!email || !password) {
        msg.innerText = "البريد وكلمة المرور مطلوبة";
        return;
    }
    let users = getUsers();
    if (users[email]) {
        msg.innerText = "البريد موجود بالفعل";
        return;
    }
    users[email] = { password: password, field: null, progress: {} };
    saveUsers(users);
    msg.innerText = "تم إنشاء الحساب! سجل الدخول الآن.";
};

// تسجيل الدخول
window.login = function() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let users = getUsers();
    let msg = document.getElementById("msg");
    if (users[email] && users[email].password === password) {
        localStorage.setItem("currentUser", email);
        showProfile(email);
    } else {
        msg.innerText = "بريد أو كلمة مرور غير صحيحة";
    }
};

// تسجيل الخروج
window.logout = function() {
    localStorage.removeItem("currentUser");
    document.getElementById("auth").style.display = "block";
    document.getElementById("profile").style.display = "none";
    document.getElementById("lessonsPanel").style.display = "none";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("msg").innerText = "";
};

// حفظ المجال المختار
window.saveField = function(fieldKey) {
    console.log("تم الضغط على المجال :" + fieldKey);
    let email = localStorage.getItem("currentUser");
    if (!email) {alert("الرجاء تسجيل الدخول اولا");
         return;}
    let users = getUsers();
    if (users[email]) {
        users[email].field = fieldKey;
        saveUsers(users);
        let fieldName = lessonsData[fieldKey] ? lessonsData[fieldKey].name : fieldKey
        document.getElementById("fieldMsg").innerText = "✅ تم حفظ مجالك: " + lessonsData[fieldKey].name;
        // عرض الدروس بعد اختيار المجال
        showLessons(fieldKey);}
        else {
            alert("حدث خطأ في بيانات المستخدم");
        }

};

// عرض الدروس الخاصة بالمجال
function showLessons(fieldKey) {
    let email = localStorage.getItem("currentUser");
    let users = getUsers();
    let progress = users[email]?.progress || {};
    let fieldData = lessonsData[fieldKey];
    if (!fieldData) return;

    let lessonsHtml = `<h3>📘 دروس ${fieldData.name}</h3><ul>`;
    fieldData.lessons.forEach(lesson => {
        let isCompleted = progress[lesson.id] || false;
        let status = isCompleted ? "✅" : "❌";
        lessonsHtml += `
            <li>
                <strong>${lesson.title}</strong> ${status}
                <button onclick="viewLesson('${fieldKey}', ${lesson.id})">عرض الدرس</button>
            </li>
        `;
    });
    lessonsHtml += `</ul><button onclick="backToProfile()">🔙 العودة إلى اختيار المجال</button>`;
    
    document.getElementById("lessonsContent").innerHTML = lessonsHtml;
    document.getElementById("profile").style.display = "none";
    document.getElementById("lessonsPanel").style.display = "block";
}

// عرض محتوى درس محدد
window.viewLesson = function(fieldKey, lessonId) {
    let fieldData = lessonsData[fieldKey];
    let lesson = fieldData.lessons.find(l => l.id === lessonId);
    if (!lesson) return;
    let email = localStorage.getItem("currentUser");
    let users = getUsers();
    let isCompleted = users[email]?.progress?.[lessonId] || false;
    
    let lessonHtml = `
        <h3>📖 ${lesson.title}</h3>
        <p>${lesson.content}</p>
        ${!isCompleted ? '<button onclick="markComplete(\'' + fieldKey + '\', ' + lessonId + ')">✔️ إنهاء الدرس</button>' : '<p>✅ لقد أنهيت هذا الدرس مسبقاً.</p>'}
        <button onclick="showLessons('${fieldKey}')">🔙 العودة إلى قائمة الدروس</button>
    `;
    document.getElementById("lessonsContent").innerHTML = lessonHtml;
};

// وضع علامة "تم" على الدرس
window.markComplete = function(fieldKey, lessonId) {
    let email = localStorage.getItem("currentUser");
    let users = getUsers();
    if (!users[email].progress) users[email].progress = {};
    users[email].progress[lessonId] = true;
    saveUsers(users);
    showLessons(fieldKey);
};

// العودة إلى شاشة اختيار المجال
window.backToProfile = function() {
    let email = localStorage.getItem("currentUser");
    document.getElementById("lessonsPanel").style.display = "none";
    document.getElementById("profile").style.display = "block";
    // تحديث الرسالة
    let users = getUsers();
    let field = users[email]?.field;
    if (field) {
        document.getElementById("fieldMsg").innerText = "📌 مجالك الحالي: " + lessonsData[field].name;
    } else {
        document.getElementById("fieldMsg").innerText = "لم تختر مجالاً بعد. اختر مجالك من الأعلى.";
    }
};

// عرض الملف الشخصي بعد تسجيل الدخول
function showProfile(email) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("profile").style.display = "block";
    document.getElementById("lessonsPanel").style.display = "none";
    document.getElementById("userEmail").innerText = email;
    let users = getUsers();
    let field = users[email]?.field;
    let fieldMsg = document.getElementById("fieldMsg");
    if (field && lessonsData[field]) {
        fieldMsg.innerText = "📌 مجالك الحالي: " + lessonsData[field].name;
    } else {
        fieldMsg.innerText = "لم تختر مجالاً بعد. اختر مجالك من الأعلى.";
    }
}

// التحقق من وجود مستخدم مسجل عند التحميل
let currentUser = localStorage.getItem("currentUser");
if (currentUser && getUsers()[currentUser]) {
    showProfile(currentUser);
} else {
    document.getElementById("auth").style.display = "block";
    document.getElementById("profile").style.display = "none";
    document.getElementById("lessonsPanel").style.display = "none";
}