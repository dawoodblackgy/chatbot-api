/**
 * api/chat.js
 * معالج الطلبات للتواصل مع OpenAI
 */
export default async function handler(req, res) {
    // إعداد رؤوس CORS للسماح بالطلبات من نطاقات مختلفة
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // التعامل مع طلبات OPTIONS (Preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // السماح فقط بطلبات POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { messages } = req.body;
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    try {
        // إعداد رسالة النظام (System Prompt) لتعريف شخصية البوت
        const systemMessage = {
            role: "system",
            content: `أنت المساعد الذكي لشركة Guard X fly، وهي شركة رائدة في التسويق الرقمي وتصميم المواقع وحلول NFC في مصر والوطن العربي.
            - اسمك: مساعد Guard X fly الذكي.
            - أسلوبك: احترافي، ودود، ومختصر.
            - اللغات: تتحدث العربية والإنجليزية بطلاقة حسب لغة المستخدم.
            - الخدمات التي تقدمها الشركة: إدارة السوشيال ميديا، الحملات الإعلانية، تصميم الهوية البصرية، برمجة المواقع، SEO، وحلول البطاقات الذكية.
            - الهدف: مساعدة العملاء في فهم الخدمات وتوجيههم للتواصل عبر واتساب أو صفحة "تواصل معنا" إذا طلبوا عرض سعر محدد.
            - التنسيق: استخدم HTML بسيط في ردودك عند الحاجة (مثل <b>للعريض</b> أو <br> لسطر جديد).`
        };

        // دمج رسالة النظام مع تاريخ المحادثة
        const conversation = [systemMessage, ...messages];

        // إرسال الطلب إلى OpenAI
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // استخدام النموذج الاقتصادي والسريع
                messages: conversation,
                max_tokens: 500, // حد أقصى للرد
                temperature: 0.7 // درجة الإبداع
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'OpenAI API Error');
        }

        // إرجاع الرد للواجهة الأمامية
        return res.status(200).json({
            reply: data.choices[0].message.content
        });

    } catch (error) {
        console.error('Chat API Error:', error);
        return res.status(500).json({ error: 'Failed to fetch response' });
    }
}
