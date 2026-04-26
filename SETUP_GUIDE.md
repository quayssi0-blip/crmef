# Ar-Ra'id Connect - دليل الإعداد السريع

## ✅ حالة البناء

- **الحالة:** ✅ Build ناجح
- **Lint:** ✅ 0 أخطاء، 6 تحذيرات (يمكن تجاهلها)
- **المنصات:** Next.js 16، React 19، Turbopack

## 🚀 البدء السريع

### 1. المتطلبات الأساسية

```bash
# تأكد من تثبيت Bun
curl -fsSL https://bun.sh/install | bash

# أو باستخدام npm
npm install -g bun
```

### 2. إعداد Supabase (10 دقائق)

#### الخطوة A: إنشاء المشروع
1. سجل في [Supabase](https://supabase.com)
2. أنشئ مشروع جديد: `arra-id-connect`
3. احفظ:
   - Project URL
   - anon/public key
   - service_role key (من Settings → API)

#### الخطوة B: تشغيل SQL Schema
```sql
-- انسخ محتوى ملف supabase/schema.sql
--七彩 SQL Editor في لوحة تحكم Supabase
-- شغل الكود لإنشاء كل الجداول والـ triggers
```

#### الخطوة C: إنشاء Storage Buckets
| Bucket | الغرض | الوصول |
|--------|-------|--------|
| `videos` | ملفات الفيديو | public read |
| `thumbnails` | صور مصغرة | public read |
| `resources` | الوثائق | public read |
| `avatars` | صور المستخدمين | public read |

#### الخطوة D: إعداد RLS Storage Policies
七彩 Storage → Policies لكل bucket:

```sql
-- مثال لـ videos bucket
CREATE POLICY "Videos publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'videos');

CREATE POLICY "Authenticated users can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'videos' AND
  auth.role() = 'authenticated'
);
```

### 3. إعداد البيئة

```bash
# نسخ ملف البيئة
cp .env.example .env.local

# تعبئة القيم:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 4. التشغيل

```bash
# تثبيت التبعيات
bun install

# تشغيل في وضع التطوير
bun dev

# أو
npm run dev
```

✅ افتح [http://localhost:3000](http://localhost:3000)

## 🏗️ بنية المشروع

```
arra-id-connect/
├── src/
│   ├── app/                    # App Router (Next.js 16)
│   │   ├── auth/              # صفحات المصادقة
│   │   │   ├── login/         # تسجيل الدخول
│   │   │   ├── signup/        # إنشاء حساب
│   │   │   └── callback/      # معالجة ردود OAuth
│   │   ├── capsules/          # صفحة الكبسلات ← مبدل
│   │   ├── resources/         # صفحة الموارد ← مبدل
│   │   ├── layout.jsx         # التخطيط الرئيسي (RTL)
│   │   ├── page.jsx           # الصفحة الرئيسية (Landing)
│   │   └── globals.css        # Tailwind + تصميم مخصص
│   ├── components/            # مكونات React
│   │   ├── Navbar.jsx         # شريط التنقل
│   │   ├── VideoCard.jsx      # بطاقة الكبسلة
│   │   ├── ResourceCard.jsx   # بطاقة المورد
│   │   ├── FilterBar.jsx      # شريط التصفية والبحث
│   │   ├── CommentSection.jsx # نظام التعليقات
│   │   └── modals/
│   │       └── VideoModal.jsx # مشغل الفيديو
│   ├── hooks/                 # React Hooks (Client Components)
│   │   ├── useAuth.js         # حالة المصادقة
│   │   ├── useVideos.js       # data fetching للفيديوهات
│   │   ├── useComments.js     # data fetching للتعليقات
│   │   └── useResources.js    # data fetching للموارد
│   └── lib/
│       └── supabase.js        # Supabase client
├── supabase/
│   └── schema.sql             # Full database migration
├── .env.example               # متغيرات البيئة template
├── .env.local                 # (gitignored) قيمك الحقيقية
├── README.md                  # السجل الكامل
└── package.json
```

## 🎨 تصميم الواجهة

### فلسفة التصميم (Zen)
- **مساحات بيضاء:** large padding/margins
- **ألوان هادئة:** Blue + Slate (لا أخضر)
- **خطوط عربية:** Amiri (للعناوين) + Noto Sans Arabic (للنصوص)
- **الحركة:** GSAP لانتقالات سلسة
- **RTL:** دعم كامل للعربية من اليمين لليسار

### الـColor Palette
```
Primary:    blue-600 (#2563eb)
Background: slate-50 → blue-50 gradient
Cards:      white with subtle shadows
Text:       slate-800 (headings), slate-600 (body)
Accent:     amber-500 (للأزرار الثانوية)
```

## 💾 قاعدة البيانات (PostgreSQL)

### الجداول الرئيسية
- **profiles** ← امتداد auth.users
- **videos** ← الكبسلات (metdata + URL)
- **comments** ← تعليقات متشعبة (threaded)
- **resources** ← الملفات (PDF, LaTeX, etc.)
- **video_likes**, **comment_likes** ← relations
- **video_views**, **resource_downloads** ← analytics

### Search
- Full-text search على Videos باستخدام GIN index
- دعم البحث بالعربية (Arabic tsvector)

### Triggers المضمنة
- تحديث `view_count` عند إضافة record في `video_views`
- تحديث `like_count` و `comment_count` تلقائياً

## 🔐 المصادقة

### خيارات الدخول
1. **Email/Password** (قاعدة)
2. **@taalim.ma** (اختياري - محاكاة لموظفي التعليم)

### Roles
- `teacher` (افتراضي)
- `mentor` (مشرف)
- `admin` (إداري)
- `researcher` (باحث - للوصول للبيانات)

## 🎬 الفيديو والـStorage

### تدفق رفع الفيديو
1. User يرفع ملف → Supabase Storage (`videos/` bucket)
2.thumbnail يتم إنشاؤه (client-side أو server-side)
3. Metadata يُحفظ في جدول `videos` مع الـURL
4. الفيديو يظهر في الـfeed بعد النشر

### أفضل الممارسات
- ✅ MP4/H.264 للتوافق
- ✅ 3-5 minutes max ( كما هو محدد)
- ✅thumbnail 16:9 ratio
- ✅ اسم الملف: `{video-id}.mp4` ( UUID)

## 💬 نظام التعليقات

### Threaded Comments
```
تعليق رئيسي
├── رد 1
├── رد 2
│   ├── رد فرعي
│   └── رد آخر
└── رد 3
```

### المزايا
- إعجابات على التعليق
- حذف/تعديل فقط بواسطة المؤلف
- عرض profile للمعلق

## 📚 الموارد

### الأنواع المدعومة
- `latex` - ملفات .tex
- `beamer` - عروض تقديمية
- `exam` - نماذج امتحانات
- `worksheet` - أوراق عمل

### التصفية
-根据 المادة (arabic, french, math)
-根据 المستوى (1-6 سنة)

## 🔍 البحث والتصفية

### Available Filters
- **بحث نصي:** title + description + tags
- **المادة:** Arabic, French, Math, Science, Islamic
- **المستوى:** 1st - 6th year
- **المنهجية:** TaRL, Explicit Teaching
- **الوسوم:** custom tags (diagnostic, guided practice, etc.)

### Full-text Search
```sql
-- استخدام GIN index مع arabic tsvector
SELECT * FROM videos
WHERE searchable @@ plainto_tsquery('arabic', 'بحث');
```

## 📊 Analytics (MVP)

### المقاييس المتتبعة
- **Videos:** views, likes, comments count
- **Resources:** download count
- **Users:** profile completeness

### future extensions
- Watch time (seconds viewed)
- Completion rate (% of video watched)
- User engagement scores

## 🚀 نشر الإنتاج (Production)

### 1. بيئة الإنتاج
```bash
# Vercel (موصى به)
vercel --prod

# أو Railway/Render
railway up
```

### 2. إعداد متغيرات البيئة في Vercel
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
```

### 3. تحسينات الإنتاج
- ✅ Images using Supabase CDN
- ✅ Video streaming using Supabase CDN
- ✅ Caching strategies في supabase

## 🐛 استكشاف الأخطاء وإصلاحها

### Error: "Missing Supabase environment variables"
**الحل:** تأكد من وجود `.env.local` مع القيم الصحيحة

### Error: "RLS policy violation"
**الحل:** تحقق من Storage Policies في Supabase dashboard

### Build fails على callback page
**الحل:** الصفحة تستخدم `useSearchParams` → مطلوب Suspense boundary (موجود)

### Videos لا تظهر
**Check:**
1. `is_published = true` في جدول Videos
2. RLS policy تسمح بالقراءة
3. Storage bucket الصلاحيات

## 📖 API Endpoints المخطط لها

```javascript
// Future: API Routes في src/app/api/
GET    /api/videos           // قائمة مع تصفية
GET    /api/videos/:id       // تفاصيل كبسلة
POST   /api/videos/:id/like  // إعجاب
GET    /api/comments/:videoId // تعليقات
POST   /api/comments         // تعليق جديد
GET    /api/resources        // قائمة الموارد
POST   /api/resources/:id/download // تحميل
```

## 🤝 المساهمة

```bash
# 1. Fork + clone
git clone <your-fork>

# 2. Create feature branch
git checkout -b feature/awesome-feature

# 3. Commit
git commit -m "إضافة ميزة: وصف مختصر"

# 4. Push
git push origin feature/awesome-feature

# 5. Open PR
```

معايير الكود:
- ✅ ESLint + Prettier
- ✅ استخدام مكونات موجودة
- ✅ تعليقات بالعربية/الإنجليزية حسب السياق
- ✅ commit messages واضحة

## 📄 الترخيص

MIT License - حر للاستخدام في البيئة التعليمية

## 👨‍🏫 الدعم

للاستفسارات التقنية:
- فتح issue في المستودع
- مراجعة docs/wiki

---

<p align="center">
  <strong>Ar-Ra'id Connect</strong><br>
  منصة التعلم بين الأقران للمعلمين المغاربة 🎓<br>
  <em>ضمن مشروع البحث التربوي للمدارس الرائدة</em>
</p>
