# Ar-Ra'id Connect

منصة التعلم بين الأقران للمعلمين المغاربة في المدارس الرائدة

## نظرة عامة

Ar-Ra'id Connect هي منصة تعلم بين الأقران مخصصة للمعلمين المغاربة العاملين في إطار **"المدارس الرائدة" (Écoles Pionnières)**. تهدف المنصة إلى سد الفجوة بين التدريب النظري والتدريس العملي من خلال مشاركة كبسلات فيديو قصيرة (3-5 دقائق) توضح أساليب تدريسية فعالة مثل **التعلم النشط (TaRL)** و **التدريس الصريح**.

هذه المنصة هي حجر الأساس في مشروع بحث تربوي بعنوان:
*"تأثير التدريب twisty بين الأقران على الأداء التربوي للمعلمين في المدارس الرائدة"*

## المميزات التقنية

- **الإطار:** Next.js 16 (App Router) - JavaScript (بدون TypeScript)
- **قاعدة البيانات والـ Backend:** Supabase (Auth, PostgreSQL, Storage)
- **التصميم:** Tailwind CSS v4 + GSAP للأنيميشن
- **اللغة:** واجهة عربية RTL مع دعم كامل
- **الألوان:** ألوان هادئة (أزرق، رمادي) - بدون الأخضر حسب المتطلبات

## المميزات الوظيفية (MVP)

### 1. نظام المصادقة
- تسجيل الدخول بالبريد الإلكتروني وكلمة المرور
- دعم دخول موظفي التعليم через @taalim.ma
- ملفات شخصية للمعلمين (الاسم، المدرسة، التخصص، سنوات الخبرة)

### 2. خلاصة الكبسلات
- عرض شبكي للكبسلات المرئية
- تصفية متقدمة حسب:
  - المنهجية (التعلم النشط، التدريس الصريح)
  - المادة (العربية، الفرنسية، الرياضيات)
  - المستوى (1-6)
  - الوسوم (تقويم تشخيصي، ممارسة موجهة، إلخ)
- بحث نصي في العناوين والوصف

### 3. مشغل الفيديو والنقاش
- تشغيل الفيديو في نافذة منبثقة
- نظام تعليقات متشعب (threaded)
- إعجابات على التعليق
- عرض بيانات المعلم

### 4. مستودع الموارد
- وثائق LaTeX وعروض Beamer
- نماذج امتحانات
- تصفية حسب المادة والمستوى
- عداد التحميلات

### 5. إحصائيات
- عداد المشاهدات
- عداد الإعجابات
- عداد التعليقات

## المتطلبات

- Node.js 18+
- Bun (مُوصى به)
- account Supabase

## الإعداد والتثبيت

### 1. استنساخ المشروع

```bash
git clone <repository-url>
cd arra-id-connect
```

### 2. تثبيت التبعيات

```bash
bun install
```

### 3. إعداد Supabase

1. إنشاء مشروع جديد على [Supabase](https://supabase.com)
2. إنشاء قاعدة بيانات باستخدام SQL التالي:

```sql
-- تشغيل سكريبت إعداد قاعدة البيانات
-- راجع ملف supabase/schema.sql للحصول على كود كامل
```

3. إنشاء Storage Buckets:
   - `videos` للملفات المرئية
   - `thumbnails` للصور المصغرة
   - `resources` للمستندات
   - `avatars` لصور المستخدمين

4. configuración RLS (Row Level Security) كما هي محددة في الملف

### 4. متغيرات البيئة

نسخ ملف `.env.example` إلى `.env.local` وتعبئة القيم:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 5. تشغيل التطبيق

```bash
bun dev
```

زيارة [http://localhost:3000](http://localhost:3000)

## خطوات إعداد قاعدة البيانات

1. **تشغيل migrations:**
   - في لوحة تحكم Supabase، انتقل إلى SQL Editor
   - تشغيل الكود الموجود في `supabase/schema.sql`

2. **إنشاء Storage Buckets:**
   - Storage → New Bucket
   - إنشاء 4 buckets: `videos`, `thumbnails`, `resources`, `avatars`
   - تعيين سياسات الوصول العامةREAD للجميع (أو RLS) كما هو موضح في الـSchema

3. **تفعيل المصادقة:**
   - Authentication → Settings
   - تمكين Email/Password auth
   - (اختياري) إعداد OAuth إذا لزم الأمر

4. **إعداد triggers و functions:**
   - الملف يحتوي على triggers لعد المشاهدات والإعجابات

## بنية المشروع

```
src/
├── app/                    # App Router
│   ├── auth/
│   │   ├── login/         # صفحة تسجيل الدخول
│   │   ├── signup/        # صفحة إنشاء الحساب
│   │   └── callback/      # معالجة ردود المصادقة
│   ├── capsules/          # صفحة الكبسلات
│   ├── resources/         # صفحة الموارد
│   ├── layout.jsx         # التخطيط الرئيسي
│   ├── page.jsx           # الصفحة الرئيسية
│   └── globals.css        # الأنماط العامة
├── components/            # المكونات
│   ├── Navbar.jsx
│   ├── VideoCard.jsx
│   ├── ResourceCard.jsx
│   ├── FilterBar.jsx
│   ├── CommentSection.jsx
│   └── modals/
│       └── VideoModal.jsx
├── hooks/                # React Hooks
│   ├── useAuth.js
│   ├── useVideos.js
│   ├── useComments.js
│   └── useResources.js
└── lib/                  # Utilities
    └── supabase.js
supabase/
└── schema.sql           # Full database schema
```

## مصطلحات تربوية مستخدمة في الواجهة

- **التعلم النشط** (TaRL - Teaching at the Right Level)
- **التدريس الصريح** (Explicit Teaching)
- **الممارسة الموجهة** (Guided Practice)
- **التقويم التشخيصي** (Diagnostic Assessment)
- **المستوى (السنة الأولى، الثانية، ...)** (Grade Level)
- **الكبسلة** (Video Capsule)
- **المورد** (Resource)

## الألوان والتصميم

- **الأزرق الأساسي:** #3b82f6 (Tailwind blue-600)
- **الرمادي:** slate palette
- **الخلفيات:** درجات من الأزرق الفاتح والرمادي الدافئ
- **بدون أخضر:** Towns constraints العميل

## API Endpoints (مثال)

```javascript
// جلب الكبسلات
GET /api/videos?subject=math&grade_level=3

// جلب مورد معين
GET /api/resources/:id

// إضافة تعليق
POST /api/comments
{
  "video_id": "...",
  "content": "...",
  "parent_id": null // أو معرف التعليق الأب
}
```

## الدعم والمساهمة

لإعداد المشروع للمشاركة:
1. fork المستودع
2. إنشاء branch للميزة (`git checkout -b feature/amazing-feature`)
3. commit التغييرات (`git commit -m 'إضافة ميزة رائعة'`)
4. push إلى branch (`git push origin feature/amazing-feature`)
5. فتح Pull Request

للمشاكل والاقتراحات، يرجى فتح issue في المستودع.

## الترخيص

هذا المشروع مرخص تحت [MIT License](LICENSE).

## المؤلف

- **Brahim Bourkia** - المطور الرئيسي
- مشروع بحث تربوي - المدارس الرائدة 2024

---

<p align="center">
  منصة تعلم بين الأقران للمعلمين المغاربة 🎓
</p>