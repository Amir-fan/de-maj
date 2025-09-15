// DE-MAJ Architecture - Simple Translation System

const translations = {
    en: {
        // Navigation
        'nav.home': 'Home',
        'nav.about': 'About',
        'nav.projects': 'Projects',
        'nav.catalogue': 'Catalogue',
        'nav.resume': 'Resume',
        'nav.connect': 'Connect',
        'nav.team': 'Our Team',
        
        // Hero Section
        'hero.title': 'It’s not just about buildings, it’s about belonging.',
        'hero.subtitle': 'Creating meaningful spaces that inspire, endure, and connect communities through thoughtful design and sustainable architecture.',
        'hero.viewProjects': 'View Projects',
        'hero.getInTouch': 'Get In Touch',
        
        // About Section
        'about.title': 'About Us',
        'about.subtitle': 'Discover our vision, values, and commitment to architectural excellence',
        'about.description': 'With us, architecture is more than just buildings, it\'s about creating meaningful spaces that inspire, endure, and connect. Every project is a collaboration. We listen closely, think deeply, and design intentionally, because we believe great architecture begins with understanding.',
        'about.portfolio': 'With a portfolio that spans residential, commercial, and public projects, we combine creativity with technical precision to deliver spaces that are both beautiful and functional. Sustainability, innovation, and context-sensitive design lie at the heart of our process.',
        'about.short': 'architecture is more than just buildings, it\'s about creating meaningful spaces that inspire, endure, and connect... let\'s build something lasting, together.',
        'about.vision': 'Our Vision',
        'about.visionText': 'We envision a world where architecture serves as a catalyst for positive change, socially, environmentally, and culturally. Our aim is to shape the future of the built environment by designing spaces that not only meet today\'s needs but also anticipate tomorrow\'s challenges.',
        'about.since': 'Since 1890',
        'about.yearsExperience': 'Years of Excellence',
        'about.projectsCompleted': 'Projects Completed',
        'about.awardsWon': 'Awards Won',
        'about.sustainable': 'Sustainable Design',
        'about.innovative': 'Innovative Solutions',
        'about.clientFocused': 'Client-Focused',
        
        // Projects Section
        'projects.badge': 'Portfolio',
        'projects.title': 'Our Latest Projects',
        'projects.subtitle': 'Explore our portfolio of innovative architectural solutions across residential, commercial, and hospitality sectors',
        'projects.viewAll': 'View All Projects',
        'projects.viewDetails': 'View Details',
        'projects.gallery': 'Gallery',
        'projects.images': 'Images',
        'projects.heroTitle': 'Our Projects',
        'projects.heroSubtitle': 'Explore our portfolio of innovative architectural solutions across residential, commercial, and hospitality sectors',
        'projects.pageTitle': 'Our Portfolio',
        'projects.pageSubtitle': 'Discover our diverse range of architectural projects across different sectors and scales',
        'projects.loadingTitle': 'Loading Projects...',
        'projects.loadingDesc': 'Please wait while we load our portfolio.',
        
        // Values Section
        'values.title': 'Our Core Values',
        'values.subtitle': 'The principles that guide every project we undertake',
        'values.sustainability': 'Creating environmentally responsible designs that minimize impact while maximizing efficiency and beauty.',
        'values.context': 'Understanding the unique character of each site and community to create designs that truly belong.',
        'values.precision': 'Attention to detail in every aspect of design, from concept to construction, ensuring excellence.',
        'values.humanCentered': 'Designing spaces that enhance human experience, comfort, and well-being above all else.',
        'values.sustainabilityDesc': 'We design with the future in mind, creating buildings that are energy-efficient, environmentally responsible, and built to last for generations.',
        'values.contextSensitive': 'Context-Sensitive Design',
        'values.contextSensitiveDesc': 'Every project is unique, and we carefully consider the local context, culture, and environment to create designs that feel authentic and appropriate.',
        'values.humanCenteredDesc': 'People are at the heart of everything we do. We design spaces that enhance well-being, foster connection, and support the activities of daily life.',
        'values.innovation': 'Innovation',
        'values.innovationDesc': 'We embrace new technologies, materials, and design approaches while maintaining the timeless principles of good architecture.',
        
        // Common translations
        'common.sustainability': 'Sustainability',
        'common.context': 'Context',
        'common.precision': 'Precision',
        'common.humanCentered': 'Human-Centered',
        'common.since1890': 'Since we Started work in 1890',
        'common.loremIpsum': 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. There are many variations of passages of Lorem Ipsum available.',
        'common.learnMore': 'Learn More',
        'common.tagline': 'Shaping The Future Of Cities through thoughtful design and sustainable architecture.',
        'common.quickLinks': 'Quick Links',
        'common.contactInfo': 'Contact Info',
        'common.aboutUs': 'About Us',
        'common.contact': 'Contact',
        'common.allRightsReserved': 'All rights reserved.',
        'common.getStarted': 'Get Started',
        'common.viewOurWork': 'View Our Work',
        'common.viewAllProjects': 'View All Projects',
        
        // About Page
        'aboutPage.title': 'About Us',
        'aboutPage.subtitle': 'Discover our vision, values, and commitment to architectural excellence',
        'aboutPage.ourStory': 'Our Story',
        'aboutPage.storyText': 'Architecture is more than just buildings, it\'s about creating meaningful spaces that inspire, endure, and connect. For over 130 years, we have been committed to pushing the boundaries of architectural design while maintaining a deep respect for the communities we serve.',
        'aboutPage.storyText2': 'Our work reflects our belief that great architecture has the power to transform lives and strengthen communities. We approach each project with curiosity, creativity, and a commitment to excellence that has earned us recognition in the field of sustainable and innovative design.',
        'aboutPage.storyText3': 'We approach each project with curiosity, creativity, and a commitment to excellence that has earned us recognition in the field of sustainable and innovative design.',
        'aboutPage.ourVision': 'Our Vision',
        'aboutPage.visionText': 'We believe in the power of architecture to create positive change in our communities. Our vision is rooted in sustainability, context-sensitive design, and human-centered approaches that respect both the environment and the people who inhabit our spaces.',
        'aboutPage.ourMission': 'Our Mission',
        'aboutPage.missionText': 'Through innovation, collaboration, and a commitment to design excellence, we create buildings that not only serve their immediate purpose but contribute to a better future for generations to come.',
        'aboutPage.ourValues': 'Our Values',
        'aboutPage.valuesSubtitle': 'The principles that guide our work',
        'aboutPage.sustainabilityText': 'We are committed to creating environmentally responsible designs that minimize impact while maximizing efficiency and beauty.',
        'aboutPage.contextText': 'We understand the unique character of each site and community to create designs that truly belong.',
        'aboutPage.precisionText': 'Attention to detail in every aspect of design, from concept to construction, ensuring excellence.',
        'aboutPage.humanCenteredText': 'Designing spaces that enhance human experience, comfort, and well-being above all else.',
        'aboutPage.ourTeam': 'Our Team',
        'aboutPage.teamSubtitle': 'Meet the architects and designers behind our success',
        'aboutPage.teamMember1': 'Shahad Al-Majeed',
        'aboutPage.teamMember1Role': 'Principal Architect',
        'aboutPage.teamMember1Bio': 'With over 15 years of experience in architectural design, Shahad leads our team with a vision for sustainable and innovative solutions.',
        'aboutPage.teamMember2': 'Design Team',
        'aboutPage.teamMember2Role': 'Creative Professionals',
        'aboutPage.teamMember2Bio': 'Our diverse team of architects, designers, and engineers brings together expertise from around the world to create exceptional spaces.',
        'aboutPage.teamMember3': 'Consultants',
        'aboutPage.teamMember3Role': 'Specialized Experts',
        'aboutPage.teamMember3Bio': 'We work with leading consultants in sustainability, engineering, and technology to ensure the highest quality outcomes.',
        'aboutPage.ctaTitle': 'Ready to work with us?',
        'aboutPage.ctaSubtitle': 'Let\'s discuss your next architectural project',
        'aboutPage.readyToWork': 'Ready to work together?',
        'aboutPage.readyToWorkSub': 'Let\'s discuss your next architectural project and explore how we can bring your vision to life.',
        'aboutPage.getInTouch': 'Get In Touch',
        'aboutPage.viewOurWork': 'View Our Work',
        
        // CTA Section
        'cta.title': 'Let\'s build something lasting, together.',
        'cta.subtitle': 'Ready to start your next architectural project? Get in touch with our team.',
        'cta.getInTouch': 'Get In Touch',
        'cta.viewOurWork': 'View Our Work',
        
        // Contact Page
        'contactPage.title': 'Connect',
        'contactPage.subtitle': 'Get in touch with our team to discuss your next architectural project',
        'contactPage.contactInfo': 'Contact Information',
        'contactPage.office': 'Office',
        'contactPage.address': '123 Architecture Street, Design District, City 12345',
        'contactPage.phone': 'Phone',
        'contactPage.email': 'Email',
        'contactPage.hours': 'Office Hours',
        'contactPage.hoursText': 'Monday - Friday: 9:00 AM - 6:00 PM',
        'contactPage.sendMessage': 'Send us a Message',
        'contactPage.name': 'Your Name',
        'contactPage.emailField': 'Your Email',
        'contactPage.subject': 'Subject',
        'contactPage.message': 'Your Message',
        'contactPage.attach': 'Attach Files (Optional)',
        'contactPage.send': 'Send Message',
        
        // Footer
        'footer.contact': 'Contact',
        'footer.quickLinks': 'Quick Links',
        'footer.followUs': 'Follow Us',
        'footer.rights': '© 2024 DE-MAJ Architecture. All rights reserved.'
    },
    
    ar: {
        // Navigation
        'nav.home': 'الرئيسية',
        'nav.about': 'من نحن',
        'nav.projects': 'المشاريع',
        'nav.catalogue': 'الكتالوج',
        'nav.resume': 'السيرة الذاتية',
        'nav.connect': 'تواصل معنا',
        'nav.team': 'فريقنا',
        
        // Hero Section
        'hero.title': 'العمارة لا تقتصر على تشييد المباني، بل هي خلق إحساس بالانتماء',
        'hero.subtitle': 'نحن نخلق مساحات ذات معنى تلهم وتدوم وتوصل المجتمعات من خلال التصميم المدروس والعمارة المستدامة.',
        'hero.viewProjects': 'عرض المشاريع',
        'hero.getInTouch': 'تواصل معنا',
        
        // About Section
        'about.title': 'من نحن',
        'about.subtitle': 'اكتشف رؤيتنا وقيمنا والتزامنا بالتميز المعماري',
        'about.description': 'معنا، العمارة أكثر من مجرد مباني—إنها خلق مساحات ذات معنى تلهم وتدوم وتوصل. كل مشروع هو تعاون. نستمع بعناية، نفكر بعمق، ونصمم بقصد—لأننا نؤمن أن العمارة العظيمة تبدأ بالفهم.',
        'about.portfolio': 'مع محفظة تشمل المشاريع السكنية والتجارية والعامة، نجمع بين الإبداع والدقة التقنية لتقديم مساحات جميلة ووظيفية. الاستدامة والابتكار والتصميم الحساس للسياق تكمن في قلب عملية عملنا.',
        'about.short': 'العمارة أكثر من مجرد مباني—إنها خلق مساحات ذات معنى تلهم وتدوم وتوصل… دعنا نبني شيئاً يدوم—معاً.',
        'about.vision': 'رؤيتنا',
        'about.visionText': 'نحن نتخيل عالماً حيث تكون العمارة محفزاً للتغيير الإيجابي—اجتماعياً وبيئياً وثقافياً. هدفنا هو تشكيل مستقبل البيئة المبنية من خلال تصميم مساحات لا تلبي احتياجات اليوم فحسب، بل تتوقع تحديات الغد.',
        'about.since': 'منذ 1890',
        'about.yearsExperience': 'سنوات من التميز',
        'about.projectsCompleted': 'مشروع مكتمل',
        'about.awardsWon': 'جائزة فاز بها',
        'about.sustainable': 'التصميم المستدام',
        'about.innovative': 'الحلول المبتكرة',
        'about.clientFocused': 'مركز على العميل',
        
        // Projects Section
        'projects.badge': 'المحفظة',
        'projects.title': 'أحدث مشاريعنا',
        'projects.subtitle': 'استكشف محفظتنا من الحلول المعمارية المبتكرة عبر القطاعات السكنية والتجارية والضيافة',
        'projects.viewAll': 'عرض جميع المشاريع',
        'projects.viewDetails': 'عرض التفاصيل',
        'projects.gallery': 'المعرض',
        'projects.images': 'صور',
        'projects.heroTitle': 'مشاريعنا',
        'projects.heroSubtitle': 'استكشف محفظتنا من الحلول المعمارية المبتكرة عبر القطاعات السكنية والتجارية والضيافة',
        'projects.pageTitle': 'محفظتنا',
        'projects.pageSubtitle': 'اكتشف مجموعة مشاريعنا المتنوعة عبر مختلف القطاعات والأحجام',
        'projects.loadingTitle': 'جارٍ تحميل المشاريع...',
        'projects.loadingDesc': 'يرجى الانتظار أثناء تحميل محفظتنا.',
        
        // Values Section
        'values.title': 'قيمنا الأساسية',
        'values.subtitle': 'المبادئ التي توجه كل مشروع نقوم به',
        'values.sustainability': 'إنشاء تصاميم مسؤولة بيئياً تقلل من التأثير مع تعظيم الكفاءة والجمال.',
        'values.context': 'فهم الطابع الفريد لكل موقع ومجتمع لخلق تصاميم تنتمي حقاً.',
        'values.precision': 'الاهتمام بالتفاصيل في كل جانب من جوانب التصميم، من المفهوم إلى البناء، ضمان التميز.',
        'values.humanCentered': 'تصميم مساحات تعزز التجربة البشرية والراحة والرفاهية فوق كل شيء.',
        'values.sustainabilityDesc': 'نصمم مع المستقبل في الاعتبار، وخلق مباني موفرة للطاقة ومسؤولة بيئياً ومبنية لتدوم لأجيال.',
        'values.contextSensitive': 'التصميم الحساس للسياق',
        'values.contextSensitiveDesc': 'كل مشروع فريد من نوعه، ونحن نعتبر بعناية السياق المحلي والثقافة والبيئة لخلق تصاميم تبدو أصيلة ومناسبة.',
        'values.humanCenteredDesc': 'الناس في قلب كل ما نقوم به. نصمم مساحات تعزز الرفاهية وتعزز الاتصال وتدعم أنشطة الحياة اليومية.',
        'values.innovation': 'الابتكار',
        'values.innovationDesc': 'نحن نتبنى التقنيات والمواد ومناهج التصميم الجديدة مع الحفاظ على المبادئ الخالدة للعمارة الجيدة.',
        
        // Common translations
        'common.sustainability': 'الاستدامة',
        'common.context': 'السياق',
        'common.precision': 'الدقة',
        'common.humanCentered': 'متمحور حول الإنسان',
        'common.since1890': 'منذ أن بدأنا العمل في 1890',
        'common.loremIpsum': 'لوريم إيبسوم هو نص وهمي يستخدم في صناعة الطباعة والتنضيد. كان لوريم إيبسوم ولايزال المعيار للنص الوهمي منذ القرن الخامس عشر.',
        'common.learnMore': 'اعرف المزيد',
        'common.tagline': 'تشكيل مستقبل المدن من خلال التصميم المدروس والعمارة المستدامة.',
        'common.quickLinks': 'روابط سريعة',
        'common.contactInfo': 'معلومات الاتصال',
        'common.aboutUs': 'من نحن',
        'common.contact': 'تواصل معنا',
        'common.allRightsReserved': 'جميع الحقوق محفوظة.',
        'common.getStarted': 'ابدأ الآن',
        'common.viewOurWork': 'شاهد أعمالنا',
        'common.viewAllProjects': 'عرض جميع المشاريع',
        
        // About Page
        'aboutPage.title': 'من نحن',
        'aboutPage.subtitle': 'اكتشف رؤيتنا وقيمنا والتزامنا بالتميز المعماري',
        'aboutPage.ourStory': 'قصتنا',
        'aboutPage.storyText': 'العمارة أكثر من مجرد مباني—إنها خلق مساحات ذات معنى تلهم وتدوم وتوصل… دعنا نبني شيئاً يدوم—معاً.',
        'aboutPage.storyText2': 'منذ تأسيسنا، كنا ملتزمين بدفع حدود التصميم المعماري مع الحفاظ على احترام عميق للمجتمعات التي نخدمها. عملنا يعكس اعتقادنا أن العمارة العظيمة لديها القدرة على تحويل الأرواح وتقوية المجتمعات.',
        'aboutPage.storyText3': 'نقترب من كل مشروع بالفضول والإبداع والالتزام بالتميز الذي أكسبنا الاعتراف في مجال التصميم المستدام والمبتكر.',
        'aboutPage.ourVision': 'رؤيتنا',
        'aboutPage.visionText': 'نؤمن بقوة العمارة في خلق تغيير إيجابي في مجتمعاتنا. رؤيتنا متجذرة في الاستدامة والتصميم الحساس للسياق والنهج المتمحورة حول الإنسان التي تحترم البيئة والأشخاص الذين يسكنون مساحاتنا.',
        'aboutPage.ourValues': 'قيمنا',
        'aboutPage.valuesSubtitle': 'المبادئ التي توجه عملنا',
        'aboutPage.sustainabilityText': 'نحن ملتزمون بإنشاء تصاميم مسؤولة بيئياً تقلل من التأثير مع تعظيم الكفاءة والجمال.',
        'aboutPage.contextText': 'نفهم الطابع الفريد لكل موقع ومجتمع لخلق تصاميم تنتمي حقاً.',
        'aboutPage.precisionText': 'الاهتمام بالتفاصيل في كل جانب من جوانب التصميم، من المفهوم إلى البناء، ضمان التميز.',
        'aboutPage.humanCenteredText': 'تصميم مساحات تعزز التجربة البشرية والراحة والرفاهية فوق كل شيء.',
        'aboutPage.ourTeam': 'فريقنا',
        'aboutPage.teamSubtitle': 'تعرف على المهندسين والمصممين وراء نجاحنا',
        'aboutPage.teamMember1': 'شهد الماجد',
        'aboutPage.teamMember1Role': 'المهندس الرئيسي',
        'aboutPage.teamMember1Bio': 'مع أكثر من 15 عاماً من الخبرة في التصميم المعماري، تقود شهد فريقنا برؤية للحلول المستدامة والمبتكرة.',
        'aboutPage.teamMember2': 'فريق التصميم',
        'aboutPage.teamMember2Role': 'المهنيون المبدعون',
        'aboutPage.teamMember2Bio': 'فريقنا المتنوع من المهندسين والمصممين يجمع خبرات من جميع أنحاء العالم لخلق مساحات استثنائية.',
        'aboutPage.teamMember3': 'المستشارون',
        'aboutPage.teamMember3Role': 'الخبراء المتخصصون',
        'aboutPage.teamMember3Bio': 'نعمل مع مستشارين رائدين في الاستدامة والهندسة والتكنولوجيا لضمان أعلى جودة للنتائج.',
        'aboutPage.ctaTitle': 'مستعد للعمل معنا؟',
        'aboutPage.ctaSubtitle': 'دعنا نناقش مشروعك المعماري التالي',
        'aboutPage.readyToWork': 'مستعد للعمل معاً؟',
        'aboutPage.readyToWorkSub': 'دعنا نناقش مشروعك المعماري التالي ونستكشف كيف يمكننا إحياء رؤيتك.',
        'aboutPage.getInTouch': 'تواصل معنا',
        'aboutPage.viewOurWork': 'شاهد أعمالنا',
        
        // CTA Section
        'cta.title': 'دعنا نبني شيئاً يدوم—معاً.',
        'cta.subtitle': 'مستعد لبدء مشروعك المعماري التالي؟ تواصل مع فريقنا.',
        'cta.getInTouch': 'تواصل معنا',
        'cta.viewOurWork': 'عرض أعمالنا',
        
        // Contact Page
        'contactPage.title': 'تواصل معنا',
        'contactPage.subtitle': 'تواصل مع فريقنا لمناقشة مشروعك المعماري القادم',
        'contactPage.contactInfo': 'معلومات الاتصال',
        'contactPage.office': 'المكتب',
        'contactPage.address': '123 شارع العمارة، حي التصميم، المدينة 12345',
        'contactPage.phone': 'الهاتف',
        'contactPage.email': 'البريد الإلكتروني',
        'contactPage.hours': 'ساعات العمل',
        'contactPage.hoursText': 'الاثنين - الجمعة: 9:00 ص - 6:00 م',
        'contactPage.sendMessage': 'أرسل لنا رسالة',
        'contactPage.name': 'اسمك',
        'contactPage.emailField': 'بريدك الإلكتروني',
        'contactPage.subject': 'الموضوع',
        'contactPage.message': 'رسالتك',
        'contactPage.attach': 'إرفاق ملفات (اختياري)',
        'contactPage.send': 'إرسال الرسالة',
        
        // Footer
        'footer.contact': 'تواصل معنا',
        'footer.quickLinks': 'روابط سريعة',
        'footer.followUs': 'تابعنا',
        'footer.rights': '© 2024 دي-ماج للعمارة. جميع الحقوق محفوظة.'
    },
    
    tr: {
        // Navigation
        'nav.home': 'Ana Sayfa',
        'nav.about': 'Hakkımızda',
        'nav.projects': 'Projeler',
        'nav.catalogue': 'Katalog',
        'nav.resume': 'Özgeçmiş',
        'nav.connect': 'İletişim',
        'nav.team': 'Ekibimiz',
        
        // Hero Section
        'hero.title': 'Mimarlık yalnızca binalarla ilgili değil, aidiyet duygusuyla ilgilidir.',
        'hero.subtitle': 'Düşünceli tasarım ve sürdürülebilir mimari aracılığıyla toplulukları ilham veren, dayanıklı ve bağlayan anlamlı alanlar yaratıyoruz.',
        'hero.viewProjects': 'Projeleri Görüntüle',
        'hero.getInTouch': 'İletişime Geç',
        
        // About Section
        'about.title': 'Hakkımızda',
        'about.subtitle': 'Vizyonumuzu, değerlerimizi ve mimari mükemmelliğe olan bağlılığımızı keşfedin',
        'about.description': 'Bizimle mimarlık sadece binalardan fazlasıdır—ilham veren, dayanıklı ve bağlayan anlamlı alanlar yaratmakla ilgilidir. Her proje bir işbirliğidir. Dikkatle dinliyor, derinlemesine düşünüyor ve kasıtlı olarak tasarlıyoruz—çünkü büyük mimarlığın anlayışla başladığına inanıyoruz.',
        'about.portfolio': 'Konut, ticari ve kamu projelerini kapsayan portföyümüzle, hem güzel hem de işlevsel alanlar sunmak için yaratıcılığı teknik hassasiyetle birleştiriyoruz. Sürdürülebilirlik, yenilik ve bağlama duyarlı tasarım sürecimizin kalbinde yer alıyor.',
        'about.short': 'mimarlık sadece binalardan fazlasıdır—ilham veren, dayanıklı ve bağlayan anlamlı alanlar yaratmakla ilgilidir… birlikte kalıcı bir şey inşa edelim.',
        'about.vision': 'Vizyonumuz',
        'about.visionText': 'Mimarlığın sosyal, çevresel ve kültürel olarak olumlu değişimin katalizörü olarak hizmet ettiği bir dünya hayal ediyoruz. Amacımız, sadece bugünün ihtiyaçlarını karşılamakla kalmayıp yarının zorluklarını da öngören alanlar tasarlayarak yapılı çevrenin geleceğini şekillendirmektir.',
        'about.since': '1890\'dan Beri',
        'about.yearsExperience': 'Mükemmellik Yılları',
        'about.projectsCompleted': 'Tamamlanan Proje',
        'about.awardsWon': 'Kazanılan Ödül',
        'about.sustainable': 'Sürdürülebilir Tasarım',
        'about.innovative': 'Yenilikçi Çözümler',
        'about.clientFocused': 'Müşteri Odaklı',
        
        // Projects Section
        'projects.badge': 'Portföy',
        'projects.title': 'En Son Projelerimiz',
        'projects.subtitle': 'Konut, ticari ve konaklama sektörlerinde yenilikçi mimari çözümler portföyümüzü keşfedin',
        'projects.viewAll': 'Tüm Projeleri Görüntüle',
        'projects.viewDetails': 'Detayları Görüntüle',
        'projects.gallery': 'Galeri',
        'projects.images': 'Görsel',
        'projects.heroTitle': 'Projelerimiz',
        'projects.heroSubtitle': 'Konut, ticari ve konaklama sektörlerinde yenilikçi mimari çözümler portföyümüzü keşfedin',
        'projects.pageTitle': 'Portföyümüz',
        'projects.pageSubtitle': 'Farklı sektörler ve ölçekler arasında çeşitli mimari projelerimizi keşfedin',
        'projects.loadingTitle': 'Projeler Yükleniyor...',
        'projects.loadingDesc': 'Portföyümüz yüklenirken lütfen bekleyin.',
        
        // Values Section
        'values.title': 'Temel Değerlerimiz',
        'values.subtitle': 'Üstlendiğimiz her projeyi yönlendiren ilkeler',
        'values.sustainability': 'Etkiyi minimize ederken verimliliği ve güzelliği maksimize eden çevre dostu tasarımlar yaratıyoruz.',
        'values.context': 'Her alan ve topluluğun benzersiz karakterini anlayarak gerçekten ait olan tasarımlar yaratıyoruz.',
        'values.precision': 'Konseptten inşaata kadar tasarımın her yönünde detaylara dikkat ederek mükemmelliği sağlıyoruz.',
        'values.humanCentered': 'Her şeyden önce insan deneyimini, konforunu ve refahını artıran alanlar tasarlıyoruz.',
        'values.sustainabilityDesc': 'Geleceği göz önünde bulundurarak, enerji verimli, çevre dostu ve nesiller boyunca dayanacak binalar yaratıyoruz.',
        'values.contextSensitive': 'Bağlama Duyarlı Tasarım',
        'values.contextSensitiveDesc': 'Her proje benzersizdir ve otantik ve uygun görünen tasarımlar yaratmak için yerel bağlamı, kültürü ve çevreyi dikkatle göz önünde bulunduruyoruz.',
        'values.humanCenteredDesc': 'İnsanlar yaptığımız her şeyin kalbindedir. Refahı artıran, bağlantıyı güçlendiren ve günlük yaşam aktivitelerini destekleyen alanlar tasarlıyoruz.',
        'values.innovation': 'Yenilik',
        'values.innovationDesc': 'İyi mimarinin zamansız ilkelerini korurken yeni teknolojileri, malzemeleri ve tasarım yaklaşımlarını benimsiyoruz.',
        
        // Common translations
        'common.sustainability': 'Sürdürülebilirlik',
        'common.context': 'Bağlam',
        'common.precision': 'Hassasiyet',
        'common.humanCentered': 'İnsan Merkezli',
        'common.since1890': '1890\'dan beri çalışmaya başladığımızdan beri',
        'common.loremIpsum': 'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem Ipsum\'un birçok varyasyonu mevcuttur.',
        'common.learnMore': 'Daha Fazla Bilgi',
        'common.tagline': 'Düşünceli tasarım ve sürdürülebilir mimari aracılığıyla şehirlerin geleceğini şekillendiriyoruz.',
        'common.quickLinks': 'Hızlı Bağlantılar',
        'common.contactInfo': 'İletişim Bilgileri',
        'common.aboutUs': 'Hakkımızda',
        'common.contact': 'İletişim',
        'common.allRightsReserved': 'Tüm hakları saklıdır.',
        'common.getStarted': 'Başlayın',
        'common.viewOurWork': 'Çalışmalarımızı Görüntüle',
        'common.viewAllProjects': 'Tüm Projeleri Görüntüle',
        
        // About Page
        'aboutPage.title': 'Hakkımızda',
        'aboutPage.subtitle': 'Vizyonumuzu, değerlerimizi ve mimari mükemmelliğe olan bağlılığımızı keşfedin',
        'aboutPage.ourStory': 'Hikayemiz',
        'aboutPage.storyText': 'Mimarlık sadece binalardan fazlasıdır—ilham veren, dayanıklı ve bağlayan anlamlı alanlar yaratmakla ilgilidir… birlikte kalıcı bir şey inşa edelim.',
        'aboutPage.storyText2': 'Kuruluşumuzdan bu yana, mimari tasarımın sınırlarını zorlarken hizmet ettiğimiz topluluklara derin saygı duymaya kararlıyız. Çalışmalarımız, büyük mimarlığın yaşamları dönüştürme ve toplulukları güçlendirme gücüne sahip olduğuna olan inancımızı yansıtıyor.',
        'aboutPage.storyText3': 'Her projeye merak, yaratıcılık ve sürdürülebilir ve yenilikçi tasarım alanında tanınmamızı sağlayan mükemmellik taahhüdü ile yaklaşıyoruz.',
        'aboutPage.ourVision': 'Vizyonumuz',
        'aboutPage.visionText': 'Mimarlığın topluluklarımızda olumlu değişim yaratma gücüne inanıyoruz. Vizyonumuz, hem çevreye hem de alanlarımızda yaşayan insanlara saygı duyan sürdürülebilirlik, bağlama duyarlı tasarım ve insan merkezli yaklaşımlara dayanıyor.',
        'aboutPage.ourValues': 'Değerlerimiz',
        'aboutPage.valuesSubtitle': 'Çalışmamızı yönlendiren ilkeler',
        'aboutPage.sustainabilityText': 'Etkiyi minimize ederken verimliliği ve güzelliği maksimize eden çevre dostu tasarımlar yaratmaya kararlıyız.',
        'aboutPage.contextText': 'Her alan ve topluluğun benzersiz karakterini anlayarak gerçekten ait olan tasarımlar yaratıyoruz.',
        'aboutPage.precisionText': 'Konseptten inşaata kadar tasarımın her yönünde detaylara dikkat ederek mükemmelliği sağlıyoruz.',
        'aboutPage.humanCenteredText': 'Her şeyden önce insan deneyimini, konforunu ve refahını artıran alanlar tasarlıyoruz.',
        'aboutPage.ourTeam': 'Ekibimiz',
        'aboutPage.teamSubtitle': 'Başarımızın arkasındaki mimarlar ve tasarımcılarla tanışın',
        'aboutPage.teamMember1': 'Shahad Al-Majeed',
        'aboutPage.teamMember1Role': 'Baş Mimar',
        'aboutPage.teamMember1Bio': 'Mimari tasarımda 15 yıldan fazla deneyime sahip olan Shahad, sürdürülebilir ve yenilikçi çözümler vizyonuyla ekibimizi yönetiyor.',
        'aboutPage.teamMember2': 'Tasarım Ekibi',
        'aboutPage.teamMember2Role': 'Yaratıcı Profesyoneller',
        'aboutPage.teamMember2Bio': 'Mimarlar, tasarımcılar ve mühendislerden oluşan çeşitli ekibimiz, dünyanın dört bir yanından uzmanlığı bir araya getirerek olağanüstü alanlar yaratıyor.',
        'aboutPage.teamMember3': 'Danışmanlar',
        'aboutPage.teamMember3Role': 'Uzman Uzmanlar',
        'aboutPage.teamMember3Bio': 'En yüksek kalitede sonuçlar sağlamak için sürdürülebilirlik, mühendislik ve teknoloji alanlarında önde gelen danışmanlarla çalışıyoruz.',
        'aboutPage.ctaTitle': 'Bizimle çalışmaya hazır mısınız?',
        'aboutPage.ctaSubtitle': 'Bir sonraki mimari projenizi tartışalım',
        'aboutPage.readyToWork': 'Birlikte çalışmaya hazır mısınız?',
        'aboutPage.readyToWorkSub': 'Bir sonraki mimari projenizi tartışalım ve vizyonunuzu nasıl hayata geçirebileceğimizi keşfedelim.',
        'aboutPage.getInTouch': 'İletişime Geç',
        'aboutPage.viewOurWork': 'Çalışmalarımızı Görüntüle',
        
        // CTA Section
        'cta.title': 'Birlikte kalıcı bir şey inşa edelim.',
        'cta.subtitle': 'Bir sonraki mimari projenizi başlatmaya hazır mısınız?',
        'cta.getInTouch': 'İletişime Geç',
        'cta.viewOurWork': 'Çalışmalarımızı Görüntüle',
        
        // Contact Page
        'contactPage.title': 'İletişim',
        'contactPage.subtitle': 'Bir sonraki mimari projenizi tartışmak için ekibimizle iletişime geçin',
        'contactPage.contactInfo': 'İletişim Bilgileri',
        'contactPage.office': 'Ofis',
        'contactPage.address': '123 Mimarlık Caddesi, Tasarım Bölgesi, Şehir 12345',
        'contactPage.phone': 'Telefon',
        'contactPage.email': 'E-posta',
        'contactPage.hours': 'Ofis Saatleri',
        'contactPage.hoursText': 'Pazartesi - Cuma: 09:00 - 18:00',
        'contactPage.sendMessage': 'Bize Mesaj Gönderin',
        'contactPage.name': 'Adınız',
        'contactPage.emailField': 'E-posta Adresiniz',
        'contactPage.subject': 'Konu',
        'contactPage.message': 'Mesajınız',
        'contactPage.attach': 'Dosya Ekle (Opsiyonel)',
        'contactPage.send': 'Mesaj Gönder',
        
        // Footer
        'footer.contact': 'İletişim',
        'footer.quickLinks': 'Hızlı Bağlantılar',
        'footer.followUs': 'Bizi Takip Edin',
        'footer.rights': '© 2024 DE-MAJ Mimarlık. Tüm hakları saklıdır.'
    }
};

class SimpleTranslationManager {
    constructor() {
        this.currentLanguage = localStorage.getItem('de-maj-language') || 'en';
        this.init();
    }
    
    init() {
        this.applyTranslations();
        this.bindLanguageSwitcher();
        this.updateLanguageSwitcher();
    }
    
    applyTranslations() {
        const elements = document.querySelectorAll('[data-translate]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate');
            const translation = this.getTranslation(key);
            if (translation) {
                element.textContent = translation;
            }
        });
        
        // Update HTML lang attribute
        document.documentElement.lang = this.currentLanguage;
        
        // Update text direction for Arabic
        if (this.currentLanguage === 'ar') {
            document.documentElement.dir = 'rtl';
        } else {
            document.documentElement.dir = 'ltr';
        }
        
        // Preserve flag emojis in language buttons
        this.preserveLanguageButtonFlags();
    }
    
    preserveLanguageButtonFlags() {
        // SVG flags are already in HTML, no need to modify them
        // Just ensure they're visible and properly styled
        const languageButtons = document.querySelectorAll('.language-btn');
        languageButtons.forEach(button => {
            const flagIcon = button.querySelector('.flag-icon');
            if (flagIcon) {
                // Ensure SVG is visible
                flagIcon.style.display = 'block';
            }
        });
    }
    
    getTranslation(key) {
        return translations[this.currentLanguage]?.[key] || key;
    }
    
    setLanguage(lang) {
        this.currentLanguage = lang;
        localStorage.setItem('de-maj-language', lang);
        this.applyTranslations();
        this.updateLanguageSwitcher();
    }
    
    bindLanguageSwitcher() {
        // Bind dropdown toggle
        const dropdownToggle = document.getElementById('language-toggle');
        const dropdown = document.querySelector('.language-dropdown');
        
        if (dropdownToggle && dropdown) {
            dropdownToggle.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('active');
            });
        }
        
        // Bind language options
        const languageOptions = document.querySelectorAll('.language-option');
        languageOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                e.preventDefault();
                const lang = option.getAttribute('data-lang');
                if (lang) {
                    this.setLanguage(lang);
                    dropdown.classList.remove('active');
                }
            });
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (dropdown && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
            }
        });
    }
    
    updateLanguageSwitcher() {
        // Update current language display
        const currentFlag = document.getElementById('current-flag');
        const currentLang = document.getElementById('current-lang');
        
        const flagMap = {
            'en': { flag: 'images/Flag_of_the_United_States.svg.png', text: 'EN' },
            'ar': { flag: 'images/Flag_of_Saudi_Arabia.svg.png', text: 'AR' },
            'tr': { flag: 'images/Flag_of_Turkey.svg.webp', text: 'TR' }
        };
        
        if (currentFlag && currentLang && flagMap[this.currentLanguage]) {
            currentFlag.src = flagMap[this.currentLanguage].flag;
            currentLang.textContent = flagMap[this.currentLanguage].text;
        }
    }
}

// Initialize translation manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.simpleTranslationManager = new SimpleTranslationManager();
});
