/**
 * JavaScript محسن لموقع Guard X fly
 * شات بوت ثنائي اللغة (العربية والإنجليزية) مع وظائف شاملة
 */
document.addEventListener('DOMContentLoaded', () => {
    const BRAND_NAME = "Guard X fly";
    const FORM_SUBMIT_SUCCESS_AR = 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.';
    const FORM_SUBMIT_ERROR_AR = 'فشل في إرسال الرسالة، يرجى المحاولة مرة أخرى لاحقاً.';
    const FORM_SUBMITTING_AR = 'جارِ الإرسال...';

    // تعريف ملف صوت التنبيه
    // let notificationSound;
    // try {
    //     // تأكد من وجود ملف باسم "notification.mp3" في مجلد المشروع
    //     notificationSound = new Audio('notification.mp3');
    // } catch (e) {
    //     console.warn('Could not create Audio object. Sound notifications will be disabled.', e);
    // }

    // تهيئة اللغة
    const savedLang = localStorage.getItem('siteLang') || 'ar';
    // Ensure translations are loaded before calling setLanguage
    if (typeof translations !== 'undefined') {
        setLanguage(savedLang);
    }

    // تحديث نص الزر عند التحميل
    const langSwitcher = document.getElementById('langSwitcher');
    if (langSwitcher) {
        langSwitcher.textContent = savedLang === 'ar' ? 'English' : 'العربية';
    }

    // Preloader logic
    function hidePreloader() {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500); // Match the CSS transition duration
        }
    }
    // إخفاء شاشة التحميل عند اكتمال تحميل الصفحة بالكامل بدلاً من الاعتماد على مؤقت
    window.addEventListener('load', hidePreloader);

    // تعيين السنة الحالية في الفوتر
    const currentYear = document.getElementById('current-year');
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // تحسين شريط التنقل الثابت عند التمرير
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // تفعيل قائمة الهامبرغر للشاشات الصغيرة
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }


    // التمرير السلس للروابط المرساة
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetElement = document.querySelector(anchor.getAttribute('href'));
            // التأكد من أن الرابط يشير إلى عنصر موجود في الصفحة الحالية
            // هذا يمنع الكود من العمل على روابط لصفحات أخرى ومنع التعارض
            if (!targetElement) {
                return;
            }

            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });

    // مراقب الحركة المحسن للتمرير
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.animate-on-scroll').forEach(element => {
        observer.observe(element);
    });

    // Services Stacked Slider Logic
    const servicesSlider = document.querySelector('.services-slider');
    if (servicesSlider) {
        const upBtn = document.getElementById('services-up');
        const downBtn = document.getElementById('services-down');
        const cards = Array.from(servicesSlider.querySelectorAll('.service-card'));
        let currentIndex = 0;
        let touchStartY = 0;
        let touchStartX = 0;

        // تشغيل هذا الكود فقط إذا كانت الأزرار موجودة
        if (upBtn && downBtn) {
            function updateCards(isMobile) {
                if (isMobile) {
                    // Horizontal slider logic for mobile
                    const cardWidth = servicesSlider.querySelector('.service-card').offsetWidth;
                    const gap = 30;
                    servicesSlider.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
                } else {
                    // Stacked vertical slider logic for desktop
                    servicesSlider.style.transform = ''; // Reset horizontal transform
                    cards.forEach((card, index) => {
                        const pos = index - currentIndex;
                        card.style.transform = `translateY(${pos * 10}px) scale(${1 - Math.abs(pos) * 0.1})`;
                        card.style.zIndex = cards.length - Math.abs(pos);
                        card.style.opacity = Math.abs(pos) < 3 ? '1' : '0';
                        card.classList.toggle('active', index === currentIndex);
                    });
                }
            }

            function handleResize() {
                const isMobile = window.innerWidth <= 768;
                currentIndex = 0; // Reset index on resize to avoid issues
                // Reset styles that might conflict before reapplying
                cards.forEach((card, index) => {
                    card.style.transform = '';
                    card.style.opacity = '1';
                    card.style.zIndex = '';
                });
                updateCards(isMobile);
            }

            upBtn.addEventListener('click', () => {
                const isMobile = window.innerWidth <= 768;
                if (currentIndex > 0) { currentIndex--; updateCards(isMobile); }
            });
            downBtn.addEventListener('click', () => {
                const isMobile = window.innerWidth <= 768;
                if (currentIndex < cards.length - 1) { currentIndex++; updateCards(isMobile); }
            });

            servicesSlider.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
                touchStartX = e.touches[0].clientX;
            }, { passive: true });

            servicesSlider.addEventListener('touchend', (e) => {
                const isMobile = window.innerWidth <= 768;
                if (isMobile) {
                    const touchEndX = e.changedTouches[0].clientX;
                    const swipeThreshold = 50;
                    if (touchStartX - touchEndX > swipeThreshold) {
                        downBtn.click(); // Swipe left -> next
                    } else if (touchEndX - touchStartX > swipeThreshold) {
                        upBtn.click(); // Swipe right -> prev
                    }
                } else {
                    const touchEndY = e.changedTouches[0].clientY;
                    const swipeThreshold = 50;
                    if (touchStartY - touchEndY > swipeThreshold) {
                        // Swipe Up
                        downBtn.click();
                    } else if (touchEndY - touchStartY > swipeThreshold) {
                        // Swipe Down
                        upBtn.click();
                    }
                }
            });

            window.addEventListener('resize', handleResize);
            handleResize(); // Initial setup
        }
    }

    // دالة لإظهار إشعار الواتساب المخصص
    function showWhatsAppNotification(whatsappUrl) {
        // التأكد من عدم وجود إشعار سابق
        const existingNotification = document.querySelector('.whatsapp-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        const notificationImageUrl = 'https://i.pinimg.com/originals/4e/3b/33/4e3b3327af0665f70f339cea8b3ea335.gif';

        const notification = document.createElement('div');
        notification.className = 'whatsapp-notification';
        notification.innerHTML = `
            <img src="${notificationImageUrl}" alt="Redirecting to WhatsApp">
            <p>سيتم توجيهك الآن إلى واتساب...</p>
        `;
        document.body.appendChild(notification);

        // إظهار الإشعار
        setTimeout(() => notification.classList.add('show'), 10);

        // تأخير التوجيه إلى واتساب ليلاحظ المستخدم الإشعار
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 1500); // تأخير لمدة 1.5 ثانية

        // إخفاء الإشعار بعد 4 ثوانٍ
        setTimeout(() => notification.remove(), 4000);
    }

    // إرسال النموذج المحسن
    const contactForm = document.getElementById('myContactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent; // 'إرسال الرسالة'
            submitBtn.textContent = FORM_SUBMITTING_AR;
            submitBtn.disabled = true;

            try {
                const name = form.querySelector('#name').value;
                const email = form.querySelector('#email').value;
                const phone = form.querySelector('#phone').value;
                const message = form.querySelector('#message').value;

                const targetWhatsAppNumber = '201115238909'; // الرقم المستهدف الوحيد

                const formattedMessage = `
رسالة جديدة من موقع Guard X fly:
--------------------------------
الاسم: ${name}
البريد الإلكتروني: ${email}
رقم الهاتف: ${phone || 'لم يتم إدخال رقم هاتف'}
--------------------------------
الرسالة:
${message}
                `.trim();

                const whatsappUrl = `https://wa.me/${targetWhatsAppNumber}?text=${encodeURIComponent(formattedMessage)}`;

                // إظهار الإشعار المخصص بدلاً من التنبيه
                showWhatsAppNotification(whatsappUrl);
                form.reset();
            } catch (error) {
                console.error('WhatsApp redirect error:', error);
                alert('حدث خطأ أثناء تجهيز رسالتك للواتساب. يرجى المحاولة مرة أخرى.');
            } finally {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    // وظائف الشات بوت ثنائي اللغة المحسن
    let chatbotMessages = document.getElementById('chatbot-messages');
    let chatbotInput = document.getElementById('chatbot-input');
    let chatbotWindow = document.getElementById('chatbot');
    const chatbotToggle = document.querySelector('.chatbot-toggle');
    let chatOpen = false;

    // ثوابت الذكاء الاصطناعي
    const AI_ENDPOINT = '/api/chat';
    const MAX_HISTORY_ENTRIES = 12; // الاحتفاظ بآخر 12 رسالة للسياق
    const FALLBACK_RESPONSE_AR = 'عذراً، أواجه مشكلة في الاتصال حالياً. يرجى المحاولة لاحقاً أو التواصل معنا عبر واتساب.';
    const FALLBACK_RESPONSE_EN = 'Sorry, I am facing connection issues. Please try again later or contact us via WhatsApp.';

    // مصفوفة لتخزين تاريخ المحادثة
    let conversationHistory = [];
    let isTyping = false;

    // متغيرات السحب (Drag) - نبقي عليها كما هي لأنها ممتازة
    let isDragging = false;
    let hasDragged = false;
    let dragStartX, dragStartY, initialX, initialY;

    // التأكد من وجود عناصر الشات بوت وإنشائها إذا لزم الأمر
    function ensureChatbotExists() {
        if (!chatbotWindow) {
            const div = document.createElement('div');
            div.id = 'chatbot';
            div.className = 'chatbot-window';
            div.style.display = 'none';
            div.innerHTML = `
                <div class="chatbot-header">
                    <h4>المساعد الذكي - Guard X fly</h4>
                    <button class="chatbot-close" aria-label="إغلاق المساعد الذكي">×</button>
                </div>
                <div class="chatbot-messages" id="chatbot-messages"></div>
                <!-- عنصر مؤشر الكتابة -->
                <div class="typing-indicator" id="typing-indicator" style="display:none;">
                    <span></span><span></span><span></span>
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chatbot-input" placeholder="اكتب رسالتك هنا..." aria-label="اكتب رسالتك">
                    <button id="chatbot-send-btn" aria-label="إرسال الرسالة"><i class="fas fa-paper-plane"></i></button>
                </div>
            `;
            document.body.appendChild(div);
            chatbotWindow = div;
            chatbotMessages = div.querySelector('#chatbot-messages');
            chatbotInput = div.querySelector('#chatbot-input');

            // إعادة ربط زر الإغلاق
            div.querySelector('.chatbot-close').addEventListener('click', toggleChat);
        }

        // ربط أحداث الإدخال
        if (chatbotInput) {
            const sendBtn = chatbotWindow.querySelector('#chatbot-send-btn') || chatbotInput.nextElementSibling;

            const newSendBtn = sendBtn.cloneNode(true);
            sendBtn.parentNode.replaceChild(newSendBtn, sendBtn);

            newSendBtn.addEventListener('click', handleChatInput);
            chatbotInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleChatInput();
            });
            chatbotInput.parentElement.style.display = 'flex'; // التأكد من ظهوره
        }
    }
    ensureChatbotExists();

    // تهيئة وظائف الشات بوت (النقر والسحب)
    if (chatbotToggle) {
        chatbotToggle.addEventListener('mousedown', startDrag);
        chatbotToggle.addEventListener('touchstart', startDrag, { passive: false });
        chatbotToggle.style.display = 'none'; // إخفاء زر الروبوت القديم
    }


    function startDrag(e) {
        const touch = e.type === 'touchstart' ? e.touches[0] : e;
        dragStartX = touch.clientX;
        dragStartY = touch.clientY;

        const rect = chatbotToggle.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;

        hasDragged = false; // إعادة تعيين عند كل بداية ضغط
        document.addEventListener('mousemove', doDrag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', doDrag, { passive: false });
        document.addEventListener('touchend', stopDrag);
    }

    function doDrag(e) {
        const touch = e.type === 'touchmove' ? e.touches[0] : e;
        const deltaX = touch.clientX - dragStartX;
        const deltaY = touch.clientY - dragStartY;

        // التحقق من أن الحركة تجاوزت حداً معيناً لبدء السحب
        if (!hasDragged && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
            hasDragged = true; // تم تأكيد السحب
            if (!chatbotToggle.classList.contains('dragging')) {
                chatbotToggle.style.transition = 'none'; // إلغاء الانتقال فقط عند بدء السحب
                chatbotToggle.classList.add('dragging');
            }
        }

        // إذا بدأ السحب، قم بتحديث الموضع باستمرار
        if (hasDragged) {
            e.preventDefault(); // منع تمرير الصفحة أثناء سحب الزر

            const newX = initialX + deltaX;
            const newY = initialY + deltaY;

            const maxX = window.innerWidth - chatbotToggle.offsetWidth;
            const maxY = window.innerHeight - chatbotToggle.offsetHeight;

            const boundedX = Math.max(0, Math.min(newX, maxX));
            const boundedY = Math.max(0, Math.min(newY, maxY));

            chatbotToggle.style.left = `${boundedX}px`;
            chatbotToggle.style.top = `${boundedY}px`;
            chatbotToggle.style.right = 'auto';
            chatbotToggle.style.bottom = 'auto';
        }
    }

    function stopDrag() {
        document.removeEventListener('mousemove', doDrag);
        document.removeEventListener('mouseup', stopDrag);
        document.removeEventListener('touchmove', doDrag);
        document.removeEventListener('touchend', stopDrag);

        if (hasDragged) {
            chatbotToggle.classList.remove('dragging');
            chatbotToggle.style.transition = ''; // إعادة تأثيرات الانتقال بعد انتهاء السحب
            localStorage.setItem('chatbotPosition', JSON.stringify({
                left: chatbotToggle.style.left,
                top: chatbotToggle.style.top
            }));
        } else {
            // إذا لم يكن هناك سحب، اعتبره نقرة وافتح/أغلق الشات بوت
            toggleChat();
        }
    }

    // وظيفة للتحقق من بقاء الزر ضمن حدود النافذة وتعديل موضعه
    function checkButtonBounds() {
        if (!chatbotToggle) return;
        const rect = chatbotToggle.getBoundingClientRect();
        const maxX = window.innerWidth - rect.width;
        const maxY = window.innerHeight - rect.height;

        let currentX = rect.left;
        let currentY = rect.top;

        let needsUpdate = false;

        // التحقق مما إذا كان الموضع الحالي خارج الحدود
        if (currentX < 0) { currentX = 0; needsUpdate = true; }
        if (currentY < 0) { currentY = 0; needsUpdate = true; }
        if (currentX > maxX) { currentX = maxX; needsUpdate = true; }
        if (currentY > maxY) { currentY = maxY; needsUpdate = true; }

        // التحقق مما إذا كان الزر لا يزال يستخدم right/bottom وتحويله
        const style = window.getComputedStyle(chatbotToggle);
        if (style.position === 'fixed' && (style.right !== 'auto' || style.bottom !== 'auto')) {
            needsUpdate = true;
        }

        if (needsUpdate) {
            chatbotToggle.style.left = `${currentX}px`;
            chatbotToggle.style.top = `${currentY}px`;
            chatbotToggle.style.right = 'auto';
            chatbotToggle.style.bottom = 'auto';

            // تحديث التخزين المحلي فقط إذا كان هناك تغيير في الموضع
            localStorage.setItem('chatbotPosition', JSON.stringify({
                left: chatbotToggle.style.left,
                top: chatbotToggle.style.top
            }));
        }
    }

    // استعادة موضع الزر من التخزين المحلي وضمان بقائه ضمن الحدود
    const savedPosition = localStorage.getItem('chatbotPosition');
    if (savedPosition) {
        const position = JSON.parse(savedPosition);
        if (chatbotToggle && position.left && position.top) {
            chatbotToggle.style.left = position.left;
            chatbotToggle.style.top = position.top;
            chatbotToggle.style.right = 'auto';
            chatbotToggle.style.bottom = 'auto';
        }
    }

    // التحقق من الحدود عند التحميل وبعد فترة قصيرة للسماح بالرسم
    // هذا يضمن أن الزر مرئي حتى لو تم حفظه في موضع خارج الشاشة
    setTimeout(checkButtonBounds, 100);

    // إضافة مستمع لحدث تغيير حجم النافذة
    window.addEventListener('resize', checkButtonBounds);

    // وظيفة إظهار/إخفاء الشات بوت
    function toggleChat() {
        if (!chatbotWindow) return;
        chatOpen = !chatOpen;
        if (chatOpen) {
            chatbotWindow.style.display = 'flex';
            chatbotInput.focus();

            const notification = document.querySelector('.chatbot-notification');
            if (notification) notification.style.display = 'none';

            // رسالة ترحيبية إذا كانت المحادثة فارغة
            if (conversationHistory.length === 0 && chatbotMessages.children.length === 0) {
                const lang = localStorage.getItem('siteLang') || 'ar';
                const welcomeMsg = lang === 'ar'
                    ? 'مرحباً بك في Guard X fly 👋\nكيف يمكنني مساعدتك اليوم في خدمات التسويق الرقمي؟'
                    : 'Welcome to Guard X fly 👋\nHow can I help you with digital marketing services today?';

                // إضافة رسالة الترحيب للسياق ولكن كـ 'assistant' ليعرف البوت أنه بدأ الحديث
                addBotMessage(welcomeMsg);
                conversationHistory.push({ role: 'assistant', content: welcomeMsg });
            }
        } else {
            chatbotWindow.style.display = 'none';
        }
    }

    // إضافة رسالة من المستخدم
    function addUserMessage(message) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.textContent = message;
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // إضافة رسالة من البوت (تدعم HTML)
    function addBotMessage(htmlContent) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        messageDiv.innerHTML = htmlContent; // استخدام innerHTML لدعم التنسيق
        chatbotMessages.appendChild(messageDiv);
        chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }

    // التحكم في مؤشر الكتابة
    function showTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.style.display = 'flex';
            chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
        }
    }

    function hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) indicator.style.display = 'none';
    }

    // المعالجة الرئيسية للإدخال والاتصال بالـ API
    async function handleChatInput() {
        const text = chatbotInput.value.trim();
        if (!text || isTyping) return; // منع الإرسال الفارغ أو المتكرر

        // 1. عرض رسالة المستخدم
        addUserMessage(text);
        chatbotInput.value = '';
        isTyping = true;

        // تعطيل زر الإرسال مؤقتاً
        const sendBtn = chatbotWindow.querySelector('button i.fa-paper-plane')?.parentElement;
        if(sendBtn) sendBtn.disabled = true;

        // 2. تحديث التاريخ (History)
        conversationHistory.push({ role: 'user', content: text });

        // الحفاظ على حجم التاريخ (آخر N رسائل)
        if (conversationHistory.length > MAX_HISTORY_ENTRIES) {
            conversationHistory = conversationHistory.slice(-MAX_HISTORY_ENTRIES);
        }

        // 3. إظهار مؤشر الكتابة
        showTypingIndicator();

        try {
            // 4. إرسال الطلب للـ API
            const response = await fetch(AI_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: conversationHistory })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            hideTypingIndicator();

            if (data.reply) {
                // 5. عرض الرد وتحديث التاريخ
                addBotMessage(data.reply);
                conversationHistory.push({ role: 'assistant', content: data.reply });
            } else {
                throw new Error('No reply in data');
            }

        } catch (error) {
            console.error('Chatbot Error:', error);
            hideTypingIndicator();

            // عرض رسالة الخطأ حسب اللغة
            const lang = localStorage.getItem('siteLang') || 'ar';
            const fallback = lang === 'ar' ? FALLBACK_RESPONSE_AR : FALLBACK_RESPONSE_EN;
            addBotMessage(`<span style="color:#ff6b6b;">${fallback}</span>`);
        } finally {
            isTyping = false;
            if(sendBtn) sendBtn.disabled = false;
            chatbotInput.focus();
        }
    }

    // تهيئة FAQ
    function initFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');

        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const isActive = question.classList.contains('active');

                // إغلاق جميع الأسئلة الأخرى
                faqQuestions.forEach(q => {
                    q.classList.remove('active');
                    q.nextElementSibling.classList.remove('active');
                    q.setAttribute('aria-expanded', 'false');
                });

                // فتح/إغلاق السؤال الحالي
                if (!isActive) {
                    question.classList.add('active');
                    question.nextElementSibling.classList.add('active');
                    question.setAttribute('aria-expanded', 'true');
                }
            });
        });
    }

    // تهيئة كل شيء
    initFAQ();

    const chatbotCloseBtn = document.querySelector('.chatbot-close');
    const chatbotInputContainer = document.querySelector('.chatbot-input');

    if (chatbotCloseBtn) {
        chatbotCloseBtn.addEventListener('click', toggleChat);
    }

    // إصلاح مشكلة النصوص الزائدة في قسم "من نحن"
    const aboutSection = document.querySelector('.about');
    if (aboutSection) {
        const aboutTextElements = aboutSection.querySelectorAll('p');
        aboutTextElements.forEach(p => {
            if (p.textContent.includes('undefined') || p.textContent.trim() === '') {
                p.remove();
            }
        });
    }

    // --- حقن ستايلات بطاقات المدونة (لضمان ظهورها في الصفحة الرئيسية) ---
    function injectBlogCardStyles() {
        if (document.getElementById('blog-card-styles')) return;

        const css = `
            .blog-post-card {
                background-color: #2c2c2c;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                display: flex;
                flex-direction: column;
                height: 100%;
                text-align: right;
                position: relative;
            }
            .blog-post-card:hover {
                transform: translateY(-10px);
                box-shadow: 0 8px 25px rgba(215, 55, 55, 0.3);
            }
            .blog-post-image-container {
                overflow: hidden;
                position: relative;
                height: 220px;
            }
            .blog-post-image {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.4s ease;
            }
            .blog-post-card:hover .blog-post-image {
                transform: scale(1.05);
            }
            .blog-post-content {
                padding: 20px;
                flex-grow: 1;
                display: flex;
                flex-direction: column;
            }
            .blog-post-content h3 {
                font-size: 1.2rem;
                margin-bottom: 10px;
                color: #fff;
                font-family: 'Cairo', sans-serif;
                line-height: 1.4;
            }
            .post-meta {
                font-size: 0.85rem;
                color: #aaa;
                margin-bottom: 10px;
                display: block;
            }
            .blog-post-content p {
                font-size: 0.95rem;
                color: #ccc;
                margin-bottom: 20px;
                line-height: 1.6;
            }
            .read-more-btn {
                margin-top: auto;
                display: inline-block;
                color: #d73737;
                text-decoration: none;
                font-weight: bold;
                transition: color 0.3s;
            }
            .read-more-btn:hover {
                color: #fff;
            }
            .regular-posts-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 2rem;
            }
        `;

        const style = document.createElement('style');
        style.id = 'blog-card-styles';
        style.textContent = css;
        document.head.appendChild(style);
    }
    injectBlogCardStyles();

    // --- وظائف نظام المدونة (عرض المقالات والعودة) ---
    function initBlogSystem() {
        // استخدام تفويض الحدث (Event Delegation) لضمان عمل الزر في جميع الحالات
        document.addEventListener('click', (e) => {
            const backBtn = e.target.closest('#back-to-blog');
            if (backBtn) {
                const blogList = document.getElementById('blog-list');
                const blogDetails = document.getElementById('blog-details');

                // التحقق مما إذا كنا في وضع عرض المقال (SPA)
                if (blogDetails && getComputedStyle(blogDetails).display !== 'none') {
                    e.preventDefault();
                    blogDetails.style.display = 'none';
                    if (blogList) blogList.style.display = ''; // استعادة العرض الافتراضي (grid/block)

                    window.scrollTo({ top: 0, behavior: 'smooth' });

                    // تحديث الرابط لإزالة معرف المقال
                    if (window.history.pushState) {
                        const url = new URL(window.location);
                        url.searchParams.delete('article');
                        window.history.pushState({}, '', url);
                    }
                }
            }
        });

        // إضافة تنسيق لضمان أن زر العودة يظهر فوق أي محتوى آخر
        const style = document.createElement('style');
        style.innerHTML = `
            #back-to-blog {
                position: relative;
                z-index: 9999;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);

        // التحقق من وجود مقال في الرابط عند التحميل (Deep Linking)
        const urlParams = new URLSearchParams(window.location.search);
        const articleId = urlParams.get('article');
        if (articleId && typeof openArticleView === 'function') {
            openArticleView(articleId);
        }
    }

    // دالة لفتح عرض المقال (متاحة عالمياً)
    window.openArticleView = function(articleId) {
        const blogList = document.getElementById('blog-list');
        const blogDetails = document.getElementById('blog-details');
        const contentContainer = document.getElementById('article-content');

        // إصلاح التنقل: إذا لم تكن عناصر المدونة موجودة (مثلاً في الصفحة الرئيسية)، انتقل لصفحة المدونة
        if (!blogDetails || !contentContainer) {
            window.location.href = `blog.html?article=${articleId}`;
            return;
        }

        const lang = localStorage.getItem('siteLang') || 'ar';
        if (typeof translations === 'undefined' || !translations[lang]?.articles?.[articleId]) return;

        const article = translations[lang].articles[articleId];

        // بناء المحتوى ديناميكياً
        let html = `<h1 class="article-title">${article.title}</h1>`;
        if (article.meta) html += `<div class="article-meta">${article.meta}</div>`;
        if (article.desc) html += `<div class="article-intro">${article.desc}</div>`;

        Object.keys(article).forEach(key => {
            if (['title', 'meta', 'desc', 'btn'].includes(key)) return;
            if (key.startsWith('h2')) html += `<h2>${article[key]}</h2>`;
            else if (key.startsWith('h3')) html += `<h3>${article[key]}</h3>`;
            else if (key.startsWith('p')) html += `<p>${article[key]}</p>`;
            else if (key.startsWith('li')) html += `<ul><li>${article[key]}</li></ul>`;
        });

        contentContainer.innerHTML = html;
        if (blogList) blogList.style.display = 'none';
        blogDetails.style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    initBlogSystem();

    // إضافة كلاس للجهاز الذي يدعم اللمس لتحسينات CSS
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    }

    // Enhanced Gallery Filter and Carousel Logic
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    const carousel = document.querySelector('.gallery-carousel');

    // --- تشغيل كود معرض الأعمال فقط إذا كان موجودًا في الصفحة ---
    if (carousel) {
        const prevBtn = document.querySelector('.carousel-btn.prev');
        const nextBtn = document.querySelector('.carousel-btn.next'); // There was a typo here, it should be nextBtn
        let touchStartX = 0;
        let visibleItems = [];
        let currentIndex = 0;
        let isEyeTrackingActive = true; // متغير للتحكم في أنيميشن تتبع العين

        function filterAndDisplayItems() {
            const activeFilter = document.querySelector('.filter-btn.active').dataset.filter;
            visibleItems = [];
            galleryItems.forEach(item => {
                if (activeFilter === 'all' || item.dataset.category === activeFilter) {
                    visibleItems.push(item);
                }
                item.style.display = 'none';
                item.classList.remove('active', 'flip-in', 'flip-out', 'slide-in', 'slide-out');
            });
            currentIndex = 0;
            if (visibleItems.length > 0) {
                visibleItems[currentIndex].style.display = 'flex';
                visibleItems[currentIndex].classList.add('active');
            }
        }

        function showItem(nextIndex, direction) {
            if (visibleItems.length === 0) return;

            const currentItem = visibleItems[currentIndex];
            const nextItem = visibleItems[nextIndex];

            const outClass = direction === 'next' ? 'flip-out-right' : 'strong-flip-out-left';
            const inClass = direction === 'next' ? 'flip-in-right' : 'strong-flip-in-left';

            // إيقاف أي فيديو قيد التشغيل في العنصر الحالي
            const runningVideo = currentItem.querySelector('iframe');
            if (runningVideo) {
                // استعادة المحتوى الأصلي (الصورة المصغرة) بدلاً من مجرد إزالة الفيديو
                const originalContent = currentItem.dataset.originalContent;
                if (originalContent) {
                    currentItem.innerHTML = originalContent;
                }
            }

            // إيقاف تتبع العين مؤقتاً لمنع الاهتزاز
            isEyeTrackingActive = false;

            currentItem.classList.add(outClass);

            setTimeout(() => {
                currentItem.style.display = 'none';
                currentItem.classList.remove('active', outClass);

                nextItem.style.display = 'flex';
                nextItem.classList.add('active', inClass);
                currentIndex = nextIndex;

                // إعادة تفعيل تتبع العين بعد انتهاء الأنيميشن
                isEyeTrackingActive = true;
            }, 800); // Match animation duration
        }

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                filterAndDisplayItems();
            });
        });

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const nextIndex = (currentIndex + 1) % visibleItems.length;
                showItem(nextIndex, 'next');
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const nextIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
                showItem(nextIndex, 'prev');
            });
        }

        // إضافة وظيفة التنقل بالسحب باللمس
        if ('ontouchstart' in window) {
            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            carousel.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].screenX;
                const swipeThreshold = 50; // الحد الأدنى لمسافة السحب بالبكسل

                if (touchStartX - touchEndX > swipeThreshold) {
                    // سحب لليسار -> العنصر التالي
                    if (nextBtn) nextBtn.click();
                } else if (touchEndX - touchStartX > swipeThreshold) {
                    // سحب لليمين -> العنصر السابق
                    if (prevBtn) prevBtn.click();
                }
            });
        }

        // Initial setup
        filterAndDisplayItems();

        // TV Head Animation Logic
        function initTvHeadAnimation(container) {
            const tvLogo = container.querySelector('.tv-logo');
            const tvEyes = container.querySelector('.tv-eyes');
            const pupils = container.querySelectorAll('.tv-pupil');
            const eyes = container.querySelectorAll('.tv-eye');

            if (!tvEyes || pupils.length === 0) return;

            // Start logo animation
            if (tvLogo) {
                tvLogo.classList.add('start-animation');
                tvLogo.addEventListener('animationend', () => {
                    tvEyes.style.opacity = 1;
                });
            } else {
                tvEyes.style.opacity = 1;
            }

            // Eye tracking
            document.addEventListener('mousemove', (e) => {
                // تشغيل الكود فقط إذا كان التتبع فعالاً
                if (!isEyeTrackingActive) return;

                pupils.forEach(pupil => {
                    const eye = pupil.parentElement;
                    if (!eye) return;

                    const rect = eye.getBoundingClientRect();
                    if (rect.width === 0 && rect.height === 0) return;

                    const eyeCenterX = rect.left + rect.width / 2;
                    const eyeCenterY = rect.top + rect.height / 2;
                    const deltaX = e.clientX - eyeCenterX;
                    const deltaY = e.clientY - eyeCenterY;
                    const angle = Math.atan2(deltaY, deltaX);
                    const maxPupilMove = (rect.width / 2) - (pupil.offsetWidth / 2);
                    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
                    const pupilMoveDistance = Math.min(distance * 0.1, maxPupilMove);
                    const moveX = Math.cos(angle) * pupilMoveDistance;
                    const moveY = Math.sin(angle) * pupilMoveDistance;
                    pupil.style.transform = `translate(-50%, -50%) translate(${moveX}px, ${moveY}px)`;
                });
            });

            // Random blinking
            if (eyes && eyes.length > 0) {
                setInterval(() => {
                    eyes.forEach(eye => {
                        eye.classList.add('blinking');
                        setTimeout(() => eye.classList.remove('blinking'), 400);
                    });
                }, Math.random() * 5000 + 2000);
            }
        }

        // Initialize TV Head animation when it becomes visible
        const tvContainers = document.querySelectorAll('.carousel-container, .about-image');
        if (tvContainers.length > 0) {
            const tvHeadObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        initTvHeadAnimation(entry.target);
                        tvHeadObserver.unobserve(entry.target); // Run only once per element
                    }
                });
            }, { threshold: 0.5 });

            tvContainers.forEach(container => {
                tvHeadObserver.observe(container);
            });
        }
    }

    // --- تهيئة Swiper (فريق العمل + المدونة) ---
    if (typeof Swiper !== 'undefined') {
        // 2. Blog Carousel
        const blogSwiper = new Swiper('.blog-swiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
                dynamicBullets: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 30 },
            },
            observer: true,
            observeParents: true,
        });
    }

    // --- 3D Team Carousel Logic ---
    function initialize3dCarousel(containerId, nextBtnId, prevBtnId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const carousel = container.querySelector('.carousel-3d');
        const items = container.querySelectorAll('.carousel-3d-item');
        const totalItems = items.length;
        if (totalItems === 0) return;

        const angle = 360 / totalItems;
        const radius = Math.round((items[0].offsetWidth / 2) / Math.tan(Math.PI / totalItems));
        let currentIndex = 0;
        let autoRotateInterval;
        let touchStartX = 0;
        let touchEndX = 0;

        function setupCarousel() {
            items.forEach((item, i) => {
                const rotation = angle * i;
                item.style.transform = `rotateY(${rotation}deg) translateZ(${radius}px)`;
            });
        }

        function rotateCarousel() {
            const targetAngle = -angle * currentIndex;
            carousel.style.transform = `translateZ(-${radius}px) rotateY(${targetAngle}deg)`;
        }

        function startAutoRotate() {
            autoRotateInterval = setInterval(() => {
                currentIndex++;
                rotateCarousel();
            }, 3000); // تغيير الرقم للتحكم في سرعة الدوران (3000ms = 3 ثواني)
        }

        function stopAutoRotate() {
            clearInterval(autoRotateInterval);
        }

        // إيقاف الحركة عند مرور الفأرة واستئنافها عند الابتعاد
        container.addEventListener('mouseenter', stopAutoRotate);
        container.addEventListener('mouseleave', startAutoRotate);

        // --- التحكم بالسحب باللمس ---
        container.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            stopAutoRotate(); // إيقاف الدوران التلقائي عند اللمس
        }, { passive: true });

        container.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].clientX;
            handleSwipe();
            startAutoRotate(); // استئناف الدوران التلقائي بعد انتهاء اللمس
        });

        function handleSwipe() {
            const swipeThreshold = 50; // الحد الأدنى لمسافة السحب
            if (touchStartX - touchEndX > swipeThreshold) {
                // سحب لليسار -> العنصر التالي
                currentIndex++;
                rotateCarousel();
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // سحب لليمين -> العنصر السابق
                currentIndex--;
                rotateCarousel();
            }
        }
        // --- نهاية التحكم بالسحب باللمس ---

        // --- التحكم بالأزرار (جديد) ---
        const nextBtn = document.getElementById(nextBtnId);
        const prevBtn = document.getElementById(prevBtnId);

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentIndex++;
                rotateCarousel();
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentIndex--;
                rotateCarousel();
            });
        }

        setupCarousel();
        rotateCarousel();
        startAutoRotate(); // بدء الحركة التلقائية
    }

    // --- Stacked Cards Logic ---
    function initializeStackedCards(containerId, nextBtnId, prevBtnId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const cards = Array.from(container.querySelectorAll('.stacked-card'));
        const nextBtn = document.getElementById(nextBtnId);
        const prevBtn = document.getElementById(prevBtnId);
        const resetBtn = document.getElementById('stacked-cards-reset');
        let dismissedCards = [];

        function updateCardPositions() {
            const visibleCards = cards.filter(card => !card.classList.contains('dismiss-right') && !card.classList.contains('dismiss-left'));
            visibleCards.forEach((card, index) => {
                card.style.transform = `translateY(${index * 10}px) scale(${1 - index * 0.05})`;
                card.style.zIndex = visibleCards.length - index;
                card.style.opacity = index < 3 ? 1 : 0; // Show top 3 cards
            });
        }

        function dismissCard(card, direction) {
            card.classList.add(direction === 'right' ? 'dismiss-right' : 'dismiss-left');
            dismissedCards.push(card);
            setTimeout(updateCardPositions, 100);
        }

        function bringBackCard() {
            if (dismissedCards.length === 0) return;
            const lastDismissed = dismissedCards.pop();
            lastDismissed.classList.remove('dismiss-right', 'dismiss-left');
            // A small delay to allow the card to be re-inserted before updating positions
            setTimeout(updateCardPositions, 50);
        }

        function resetCards() {
            dismissedCards.forEach(card => {
                card.classList.remove('dismiss-right', 'dismiss-left');
            });
            dismissedCards = [];
            // A small delay to allow cards to be re-inserted before updating positions
            setTimeout(updateCardPositions, 50);
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const topCard = container.querySelector('.stacked-card:not(.dismiss-right):not(.dismiss-left)');
                if (topCard) dismissCard(topCard, 'right');
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                bringBackCard();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                resetCards();
            });
        }

        // Touch controls
        let touchStartX = 0;
        let touchMoveX = 0;
        let activeCard = null;

        container.addEventListener('touchstart', (e) => {
            if (e.target.closest('.stacked-card:not(.dismiss-right):not(.dismiss-left)')) {
                activeCard = e.target.closest('.stacked-card');
                touchStartX = e.touches[0].clientX;
                activeCard.style.transition = 'none'; // Disable transition for dragging
            }
        }, { passive: true });

        container.addEventListener('touchmove', (e) => {
            if (!activeCard) return;
            touchMoveX = e.touches[0].clientX - touchStartX;
            activeCard.style.transform = `translateX(${touchMoveX}px) rotate(${touchMoveX / 20}deg)`;
        }, { passive: true });

        container.addEventListener('touchend', () => {
            if (!activeCard) return;
            activeCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
            if (Math.abs(touchMoveX) > 100) { // Swipe threshold
                dismissCard(activeCard, touchMoveX > 0 ? 'right' : 'left');
            } else {
                updateCardPositions(); // Snap back
            }
            activeCard = null;
            touchMoveX = 0;
        });

        updateCardPositions();
    }

    initializeStackedCards('stacked-cards-container', 'stacked-cards-next', 'stacked-cards-prev');

    // --- زر ماسنجر العائم (Messenger Floating Button) ---
    function createMessengerButton() {
        // إنشاء عنصر الزر
        const btn = document.createElement('div');
        btn.className = 'messenger-float';
        btn.innerHTML = `
            <div class="messenger-btn-inner">
                <i class="fab fa-facebook-messenger"></i>
                <div class="messenger-badge">1</div>
            </div>
            <div class="messenger-tooltip">تحدث معنا الآن</div>
        `;
        document.body.appendChild(btn);

        // إضافة الأنماط CSS
        const style = document.createElement('style');
        style.innerHTML = `
            .messenger-float {
                position: fixed;
                bottom: 100px;
                right: 20px;
                width: 60px;
                height: 60px;
                z-index: 9999;
                touch-action: none; /* ضروري للسحب على الهواتف */
            }
            .messenger-btn-inner {
                width: 100%;
                height: 100%;
                background: linear-gradient(45deg, #d73737, #b31d1d);
                border-radius: 50%;
                box-shadow: 0 4px 15px rgba(215, 55, 55, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: transform 0.3s ease;
            }
            .messenger-btn-inner:active { transform: scale(0.95); }
            .messenger-btn-inner i { font-size: 32px; color: white; }
            .messenger-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background-color: #ff3b30;
                color: white;
                border-radius: 20px;
                padding: 2px 6px;
                font-size: 12px;
                font-weight: bold;
                border: 2px solid white;
                min-width: 18px;
                text-align: center;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            }
            @keyframes shake {
                0% { transform: rotate(0deg); }
                5% { transform: rotate(10deg); }
                10% { transform: rotate(-10deg); }
                15% { transform: rotate(10deg); }
                20% { transform: rotate(-10deg); }
                25% { transform: rotate(0deg); }
                100% { transform: rotate(0deg); }
            }
            .messenger-btn-inner.shake {
                animation: shake 2s infinite;
            }
            .messenger-tooltip {
                position: absolute;
                right: 70px;
                top: 50%;
                transform: translateY(-50%);
                background-color: #fff;
                color: #333;
                padding: 8px 12px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: bold;
                white-space: nowrap;
                box-shadow: 0 4px 15px rgba(0,0,0,0.15);
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
                pointer-events: none;
                font-family: 'Cairo', sans-serif;
            }
            .messenger-tooltip::after {
                content: '';
                position: absolute;
                right: -6px;
                top: 50%;
                transform: translateY(-50%);
                border-width: 6px 0 6px 6px;
                border-style: solid;
                border-color: transparent transparent transparent #fff;
            }
            .messenger-float:hover .messenger-tooltip, .messenger-tooltip.show {
                opacity: 1;
                visibility: visible;
                right: 80px;
            }
        `;
        document.head.appendChild(style);

        // منطق الإشعار: يعد من 1 إلى 10 ثم يظهر +10
        const badge = btn.querySelector('.messenger-badge');
        let count = 1;
        const counterInterval = setInterval(() => {
            if (count < 10) {
                count++;
                badge.textContent = count;
            } else {
                badge.textContent = '+10';
                clearInterval(counterInterval);
                const innerBtn = btn.querySelector('.messenger-btn-inner');
                if (innerBtn) innerBtn.classList.add('shake');

                const tooltip = btn.querySelector('.messenger-tooltip');
                if (tooltip) {
                    tooltip.classList.add('show');
                    setTimeout(() => tooltip.classList.remove('show'), 5000);
                }
            }
            badge.style.transform = 'scale(1.2)';
            setTimeout(() => badge.style.transform = 'scale(1)', 200);
        }, 300);

        // منطق النقر (فتح ماسنجر)
        btn.addEventListener('click', () => {
            if (!btn.classList.contains('dragging')) {
                toggleChat(); // فتح الشات بوت بدلاً من ماسنجر
            }
        });

        // منطق السحب والإفلات
        let isDragging = false, startX, startY, initialLeft, initialTop;
        const startDrag = (e) => {
            isDragging = false;
            const touch = e.type === 'touchstart' ? e.touches[0] : e;
            startX = touch.clientX; startY = touch.clientY;
            const rect = btn.getBoundingClientRect();
            initialLeft = rect.left; initialTop = rect.top;
            btn.style.transition = 'none';
            document.addEventListener('mousemove', onDrag); document.addEventListener('mouseup', stopDrag);
            document.addEventListener('touchmove', onDrag, { passive: false }); document.addEventListener('touchend', stopDrag);
        };
        const onDrag = (e) => {
            const touch = e.type === 'touchmove' ? e.touches[0] : e;
            const dx = touch.clientX - startX; const dy = touch.clientY - startY;
            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) { isDragging = true; btn.classList.add('dragging'); e.preventDefault(); }
            if (isDragging) {
                btn.style.left = `${Math.max(0, Math.min(initialLeft + dx, window.innerWidth - btn.offsetWidth))}px`;
                btn.style.top = `${Math.max(0, Math.min(initialTop + dy, window.innerHeight - btn.offsetHeight))}px`;
                btn.style.bottom = 'auto'; btn.style.right = 'auto';
            }
        };
        const stopDrag = () => {
            document.removeEventListener('mousemove', onDrag); document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', onDrag); document.removeEventListener('touchend', stopDrag);
            btn.style.transition = 'transform 0.3s ease';
            setTimeout(() => btn.classList.remove('dragging'), 100);
        };
        btn.addEventListener('mousedown', startDrag); btn.addEventListener('touchstart', startDrag, { passive: false });
    }
    createMessengerButton();
});

/**
 * دالة لتحميل فيديو يوتيوب عند النقر.
 * يجب أن تكون هذه الدالة في النطاق العام (global scope) ليتم استدعاؤها من HTML.
 * @param {HTMLElement} element - العنصر الذي تم النقر عليه.
 * @param {string} videoId - معرف فيديو يوتيوب.
 */
function loadVideo(element, videoId) {
    // تخزين المحتوى الأصلي (الصورة المصغرة) إذا لم يتم تخزينه من قبل
    if (!element.dataset.originalContent) {
        element.dataset.originalContent = element.innerHTML;
    }
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
    iframe.title = "YouTube video player";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    iframe.allowFullscreen = true;
    element.innerHTML = '';
    element.appendChild(iframe);
    element.onclick = null; // إزالة الحدث لمنع إعادة التحميل
}

// دالة تبديل اللغة
function toggleLanguage() {
    const currentLang = document.documentElement.lang || 'ar';
    const newLang = currentLang === 'ar' ? 'en' : 'ar';
    setLanguage(newLang);

    // تحديث نص الزر
    const langSwitcher = document.getElementById('langSwitcher');
    if (langSwitcher) {
        langSwitcher.textContent = newLang === 'ar' ? 'English' : 'العربية';
    }

    // Dispatch event for other scripts to react
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: newLang } }));
}

// دالة تعيين اللغة وتحديث النصوص
function setLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('siteLang', lang);

    if (typeof translations === 'undefined') return;
    const t = translations[lang];
    if (!t) return;

    // دالة مساعدة للوصول إلى القيم المتداخلة
    const getVal = (obj, path) => path.split('.').reduce((o, i) => o ? o[i] : null, obj);

    // تحديث جميع العناصر التي تحمل سمة data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = getVal(t, key);

        if (val) {
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = val;
            } else {
                // الحفاظ على الأيقونات إذا وجدت
                const icon = el.querySelector('i');
                el.innerHTML = (icon ? icon.outerHTML + ' ' : '') + val;

                // تحديث سمة data-text إذا كانت موجودة (لتأثير الجليتش)
                if (el.hasAttribute('data-text')) {
                    el.setAttribute('data-text', val);
                }
            }
        }
    });
}

// --- Background Canvas Effect ---
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById("background-canvas");
    if (!canvas) return;

    // حل مشكلة منع التمرير في شاشات اللمس: جعل الكانفاس غير قابل للتفاعل
    canvas.style.pointerEvents = "none";

    const ctx = canvas.getContext("2d");
    let mouseMoved = false;

    const pointer = {
        x: 0.5 * window.innerWidth,
        y: 0.5 * window.innerHeight
    };

    const params = {
        pointsNumber: 40,
        widthFactor: 10,
        mouseThreshold: 0.5,
        spring: 0.25,
        friction: 0.5
    };

    const trail = new Array(params.pointsNumber);
    for (let i = 0; i < params.pointsNumber; i++) {
        trail[i] = {
            x: pointer.x,
            y: pointer.y,
            dx: 0,
            dy: 0
        };
    }

    window.addEventListener("click", (e) => {
        updateMousePosition(e.pageX, e.pageY);
    });
    window.addEventListener("mousemove", (e) => {
        mouseMoved = true;
        updateMousePosition(e.pageX, e.pageY);
    });

    function updateMousePosition(eX, eY) {
        pointer.x = eX;
        pointer.y = eY;
    }

    function setupCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function update(t) {
        if (!mouseMoved) {
            pointer.x = (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) * window.innerWidth;
            pointer.y = (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.sin(0.01 * t)) * window.innerHeight;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        trail.forEach((p, pIdx) => {
            const prev = pIdx === 0 ? pointer : trail[pIdx - 1];
            const spring = pIdx === 0 ? 0.4 * params.spring : params.spring;
            p.dx += (prev.x - p.x) * spring;
            p.dy += (prev.y - p.y) * spring;
            p.dx *= params.friction;
            p.dy *= params.friction;
            p.x += p.dx;
            p.y += p.dy;
        });

        var gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        gradient.addColorStop(0, "rgba(252, 90, 3, 1)");
        gradient.addColorStop(1, "rgba(252, 202, 3, 1)");

        ctx.strokeStyle = gradient;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);

        for (let i = 1; i < trail.length - 1; i++) {
            const xc = 0.5 * (trail[i].x + trail[i + 1].x);
            const yc = 0.5 * (trail[i].y + trail[i + 1].y);
            ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
            ctx.lineWidth = params.widthFactor * (params.pointsNumber - i);
            ctx.stroke();
        }
        ctx.lineTo(trail[trail.length - 1].x, trail[trail.length - 1].y);
        ctx.stroke();

        window.requestAnimationFrame(update);
    }

    setupCanvas();
    update(0);
    window.addEventListener("resize", setupCanvas);
});
