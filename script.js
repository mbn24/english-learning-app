// دوال مساعدة للتخزين المحلي (localStorage)
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
    
    users[email] = { password: password, field: null };
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
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("msg").innerText = "";
};

// حفظ المجال المختار
window.saveField = function(field) {
    let email = localStorage.getItem("currentUser");
    if (!email) return;
    
    let users = getUsers();
    if (users[email]) {
        users[email].field = field;
        saveUsers(users);
        document.getElementById("fieldMsg").innerText = "✅ تم حفظ مجالك: " + field;
    }
};

// عرض الملف الشخصي بعد تسجيل الدخول
function showProfile(email) {
    document.getElementById("auth").style.display = "none";
    document.getElementById("profile").style.display = "block";
    document.getElementById("userEmail").innerText = email;
    
    let users = getUsers();
    let field = users[email] ? users[email].field : null;
    let fieldMsg = document.getElementById("fieldMsg");
    
    if (field) {
        fieldMsg.innerText = "📌 مجالك الحالي: " + field;
    } else {
        fieldMsg.innerText = "لم تختر مجالاً بعد. اختر مجالك من الأعلى.";
    }
}

// التحقق من وجود مستخدم مسجل عند تحميل الصفحة
let currentUser = localStorage.getItem("currentUser");
if (currentUser && getUsers()[currentUser]) {
    showProfile(currentUser);
} else {
    document.getElementById("auth").style.display = "block";
    document.getElementById("profile").style.display = "none";
}