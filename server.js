 require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// تخزين البيانات في ملف JSON
const messagesFile = path.join(__dirname, 'messages.json');

// تهيئة ملف الرسائل إذا لم يكن موجوداً
if (!fs.existsSync(messagesFile)) {
    fs.writeFileSync(messagesFile, JSON.stringify([]));
}

// إعداد CORS للسماح بجميع المصادر (لتشغيل على الإنترنت)
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));

app.use(express.json());

// تقديم ملفات الواجهة العامة (الويدجت)
app.use(express.static(path.join(__dirname, 'public')));

// بيانات الاعتماد
const ADMIN_CREDENTIALS = {
    username: 'socialnest_admin',
    password: 'SocialNest2024!'
};

// نقطة نهاية تسجيل الدخول
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        return res.status(200).json({ message: 'تسجيل الدخول ناجح' });
    } else {
        return res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
    }
});

// وظيفة لقراءة الرسائل من الملف
function readMessages() {
    try {
        const data = fs.readFileSync(messagesFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading messages:', error);
        return [];
    }
}

// وظيفة لحفظ الرسائل في الملف
function saveMessages(messages) {
    try {
        fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
        return true;
    } catch (error) {
        console.error('Error saving messages:', error);
        return false;
    }
}

// نقطة النهاية للشات بوت
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;
    const apiKey = process.env.GOOGLE_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Google API key not configured.' });
    }

    const apiURL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    try {
        const response = await axios.post(apiURL, {
            contents: [{
                parts: [{
                    text: `You are a helpful assistant for a digital marketing company called Social Nest. Answer concisely and in the same language as the user. User's message: "${userMessage}"`
                }]
            }]
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        // Extract the text from the Gemini response
        const reply = response.data.candidates[0].content.parts[0].text.trim();
        res.json({ reply: reply });
    } catch (error) {
        console.error('Error calling Google Gemini API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to fetch AI response from Google.' });
    }
});

// نقطة نهاية جديدة: الحصول على جميع الرسائل
app.get('/api/messages', (_, res) => {
    try {
        const messages = readMessages();
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// نقطة نهاية جديدة: إضافة رسالة جديدة
app.post('/api/messages', (req, res) => {
    try {
        const { name, email, phone, message } = req.body;
        
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'Name, email, and message are required' });
        }

        const messages = readMessages();
        const newMessage = {
            id: Date.now(),
            name,
            email,
            phone: phone || '',
            message,
            date: new Date().toISOString(),
            status: 'new'
        };

        messages.push(newMessage);
        
        if (saveMessages(messages)) {
            res.status(201).json(newMessage);
        } else {
            res.status(500).json({ error: 'Failed to save message' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to create message' });
    }
});

// نقطة نهاية جديدة: تحديث حالة الرسالة
app.put('/api/messages/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['new', 'read', 'replied'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const messages = readMessages();
        const messageIndex = messages.findIndex(m => m.id === parseInt(id));

        if (messageIndex === -1) {
            return res.status(404).json({ error: 'Message not found' });
        }

        messages[messageIndex].status = status;
        
        if (saveMessages(messages)) {
            res.json(messages[messageIndex]);
        } else {
            res.status(500).json({ error: 'Failed to update message' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to update message' });
    }
});

// نقطة نهاية جديدة: حذف رسالة
app.delete('/api/messages/:id', (req, res) => {
    try {
        const { id } = req.params;
        const messages = readMessages();
        const filteredMessages = messages.filter(m => m.id !== parseInt(id));

        if (messages.length === filteredMessages.length) {
            return res.status(404).json({ error: 'Message not found' });
        }

        if (saveMessages(filteredMessages)) {
            res.json({ message: 'Message deleted successfully' });
        } else {
            res.status(500).json({ error: 'Failed to delete message' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

// نقطة نهاية جديدة: الحصول على إحصائيات الرسائل
app.get('/api/messages/stats', (_, res) => {
    try {
        const messages = readMessages();
        const stats = {
            total: messages.length,
            new: messages.filter(m => m.status === 'new').length,
            read: messages.filter(m => m.status === 'read').length,
            replied: messages.filter(m => m.status === 'replied').length
        };
        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch statistics' });
    }
});

// نقطة نهاية لتقديم الداش بورد
app.get('/dashboard', (_, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// صفحة تعليمات الدمج مع الموقع الأمامي
app.get('/integration', (req, res) => {
    const host = req.headers.host;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const base = `${protocol}://${host}`;
    res.send(`
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <title>دمج ويدجت الشات</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 24px; line-height: 1.7; }
                code, pre { background: #f4f4f4; padding: 4px 6px; border-radius: 4px; direction: ltr; }
                .box { border: 1px solid #ddd; border-radius: 8px; padding: 16px; background:#fff; }
                h1 { color: #ff4500; }
                ol { padding-right: 20px; }
            </style>
        </head>
        <body>
            <h1>دمج ويدجت الشات في موقعك</h1>
            <div class="box">
                <p>انسخ هذا الوسم وضعه قبل علامة &lt;/body&gt; في موقعك:</p>
                <pre>&lt;script src="${base}/widget.js" data-endpoint="${base}/api/chat" defer&gt;&lt;/script&gt;</pre>
                <p>بعد الإضافة سيظهر زر دردشة عائم أسفل يمين صفحتك ويمكن للمستخدمين التحدث مباشرة مع الشات بوت عبر الـ API.</p>
                <p>يمكنك تخصيص النهاية الخلفية بتغيير قيمة <code>data-endpoint</code> إذا كان لديك دومين مختلف للـ API.</p>
            </div>
        </body>
        </html>
    `);
});

// نقطة نهاية رئيسية
app.get('/', (_, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Social Nest API Server</title>
            <style>
                body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
                h1 { color: #ff4500; }
                .links { margin-top: 30px; }
                .links a { display: inline-block; margin: 10px; padding: 15px 25px; 
                          background: #ff4500; color: white; text-decoration: none; 
                          border-radius: 5px; }
            </style>
        </head>
        <body>
            <h1>Social Nest API Server</h1>
            <p>الخادم يعمل بنجاح على البورت ${port}</p>
            <div class="links">
                <a href="/dashboard">الداش بورد</a>
                <a href="https://socialnest.66ghz.com/">الموقع الرئيسي</a>
            </div>
        </body>
        </html>
    `);
});

// بدء الخادم (تشغيل محلي) + تصدير التطبيق لـ Vercel
if (process.env.VERCEL) {
    // في Vercel نقوم بتصدير التطبيق كـ handler بدون تشغيل خادم مستقل
    module.exports = app;
} else {
    // تشغيل محلي/سيرفر تقليدي
    app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on port ${port}`);
        console.log(`Dashboard available at: http://localhost:${port}/dashboard`);
        console.log(`API endpoints available at: http://localhost:${port}/api/`);
    });
}