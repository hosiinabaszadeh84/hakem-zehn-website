# وضعیت واقعی Google Search Console

تاریخ اجرا: ۲۶ اکتبر ۲۰۲۶.

Property: `https://hosiinabaszadeh84.github.io/hakem-zehn-website/` از نوع URL-prefix.

## انجام‌شده

۱. فایل واقعی `google511fb0de5f6155d4.html` از دانلود مالک با دستورالعمل باز گوگل تطبیق داده شد.
۲. فایل در ریشهٔ همین پروژه منتشر و پاسخ عمومی دقیق آن بررسی شد.
۳. مالکیت با روش HTML file و پیام **Ownership auto verified** تأیید شد؛ تصویر `02-google-verified.png`.
۴. Overview باز شد؛ Performance، Indexing و Experience در وضعیت پردازش داده بودند.

## Sitemap نهایی

`https://hosiinabaszadeh84.github.io/hakem-zehn-website/sitemap.xml`

## نتیجهٔ واقعی بررسی و ارسال

| مورد | نتیجهٔ مشاهده‌شده |
|---|---|
| مالکیت URL-prefix | تأییدشده با HTML file |
| انتشار صفحات نهایی | موفق؛ Commit محتوایی `373eb9a1e29bd0f2124e4180efc118e336df9ff5`، شاخهٔ main |
| صفحهٔ اصلی در Google Index | آخرین بررسی: `URL is not on Google` و `URL is unknown to Google` |
| تست زندهٔ خانه | `URL is available to Google`، `Page can be indexed` |
| ارسال Sitemap | پیام واقعی `Sitemap submitted successfully` مشاهده و ذخیره شد |
| خواندن Sitemap در گزارش Sitemaps | همچنان `Couldn't fetch`؛ موفقیت پردازش تأیید نشده است |
| تست زندهٔ خود فایل Sitemap | موفق؛ `Crawl allowed? Yes`، `Page fetch Successful`، `Indexing allowed? Yes`؛ نمایش زمان تست: ۲۶ اکتبر ۲۰۲۶، ۹:۱۳ شب |
| اقدام پس از تست | همان Sitemap یک‌بار دوباره از فرم رسمی ارسال شد؛ گزارش هنوز خطای قبلی دارد |
| درخواست دستی ایندکس خانه | پذیرفته شد؛ پس از اقدام مالک، پیام `Indexing requested` برای URL دقیق خانه در خود Search Console بازخوانی و تصویر آن ذخیره شد |
| داده‌های نمایش/کلیک | گزارش آماده نیست؛ صفر فرض نشده است |

دو تلاش اولیه به خطای `We had a problem submitting your indexing request` همراه `Could not connect to the reCAPTCHA service` ختم شدند. سپس مالک اقدام را کامل کرد؛ بازخوانی مستقیم مرورگر پیام `Indexing requested` و دکمهٔ `REQUEST AGAIN` را برای خانه نشان داد. درخواست تکرار نشد. هیچ CAPTCHA خودکار حل نشده و هیچ روش دورزدن برای سرویس گوگل به کار نرفته است. پذیرش در صف اولویت‌دار خزش، تأیید ایندکس‌شدن یا رتبه نیست.

فایل XML به‌صورت عمومی HTTP 200 با `Content-Type: application/xml` دارد و همهٔ هشت URL آن با صفحات Canonical منطبق‌اند. فایل robots ریشهٔ میزبان HTTP 404 است؛ قانون مسدودکننده‌ای در آن مشاهده نشده است. تست زندهٔ موفق، پردازش موفق Sitemap یا ایندکس‌شدن را ثابت نمی‌کند.

شواهد: `02-google-verified.png`، `04-sitemap-submitted.png`، `08-google-live-indexable.png`، `09-sitemap-google-fetch.png` و `10-indexing-requested.png` در `delivery/website/seo/`. Schema Validator برای خانه و راهنمای شروع نیز صفر خطا و صفر هشدار گزارش کرد؛ این نتیجه، اعتبار نشانه‌گذاری است و تأیید Rich Result یا رتبه نیست.

طبق [راهنمای رسمی گزارش Sitemaps](https://support.google.com/webmasters/answer/7451001)، گوگل پس از خطای دریافت برای چند روز دوباره تلاش می‌کند. به همین دلیل نشانی تازه و نقشهٔ تکراری نساختیم و فایل معتبر را حذف نکردیم.

## نگهداری ضروری مالک

- فایل تأیید را حذف نکن. توکن ساختگی یا حساب جدید لازم نیست.
- اگر نشست گوگل قطع شد، در حساب مالک وارد همین Property شو؛ رمز یا کد ورود را در چت ارسال نکن.
- ارسال دوبارهٔ پی‌درپی Sitemap لازم نیست. گزارش خواندن را در نوبت بعد بررسی کن؛ اگر خطا باقی ماند، اول همان URL را با Test live URL و بخش Page availability عیب‌یابی کن.
- درخواست ایندکس خانه پذیرفته شده؛ اقدام فوری دیگری برای ارسال همان URL لازم نیست. وضعیت Google Index و گزارش Sitemap را در نوبت پایش بعدی بررسی کن.
- پس از پذیرش درخواست، آن را برای تغییر یکسان مکرر تکرار نکن. ایندکس‌شدن و رتبه در اختیار تصمیم‌های گوگل است و بعداً جداگانه بررسی می‌شود.
- Google Indexing API عمومی به کار نرفته است. [راهنمای رسمی شروع Search Console](https://developers.google.com/search/docs/monitor-debug/search-console-start).
