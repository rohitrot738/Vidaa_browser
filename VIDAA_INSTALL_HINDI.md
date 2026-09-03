# Hisense U7K पर VIDAA Browser लगाना

## तैयार चीजें

- App name: `VIDAA Browser`
- App URL: `https://rohitrot738.github.io/Vidaa_browser/`
- Resolution: `1080P`
- Icon URL: खाली छोड़ सकते हैं

यह VIDAA का HTML5 developer app है। यह Android APK नहीं है। Developer testing में TV app को hosted URL से जोड़ता है; ZIP को USB से APK की तरह install नहीं किया जाता।

## तरीका 1 — TV के VIDAA DevKit से

1. TV और मोबाइल/कंप्यूटर को एक ही Wi-Fi पर रखें।
2. TV के Apps में `VIDAA DevKit` खोजकर खोलें।
3. `App Manager` खोलें।
4. ये जानकारी भरें:
   - App Name: `VIDAA Browser`
   - App URL: `https://rohitrot738.github.io/Vidaa_browser/`
   - Icon URL: खाली
   - Resolution: `1080P`
5. `Install` दबाएँ।
6. VIDAA Home/Apps पर लौटें और `VIDAA Browser` खोलें।

## तरीका 2 — PC Install

1. TV में `VIDAA DevKit > App Manager > PC Install` खोलें।
2. TV पर दिखा connection code नोट करें।
3. कंप्यूटर में VIDAA Partner DevKit Web खोलें: `https://partner-doc.vidaa.com/vdocs/more/devkitweb.html`
4. Partner account से sign in करें और TV वाला code डालें।
5. App Name, App URL और Resolution ऊपर दिए अनुसार भरकर `Install` करें।

## अगर VIDAA DevKit दिखाई नहीं देता

Consumer VIDAA firmware में APK/साधारण PKG sideload का विकल्प नहीं होता। DevKit न दिखने पर पहले TV का VIDAA OS version देखें:

`Home > Settings > Support > About`

पूरा software/version number और Apps में `VIDAA DevKit` खोजने पर जो स्क्रीन दिखे, उसकी फोटो रखें। उस exact firmware के अनुसार developer-access उपलब्धता तय करनी होगी।

## Package ZIP किसलिए है

GitHub Actions का `vidaa-browser-devkit-v0.1.0.zip` source/partner handoff, local hosting और archival के लिए है। TV पर सामान्य developer test के लिए ऊपर वाला App URL इस्तेमाल करें। Official App Store package के लिए VIDAA Partner manifest, signing और certification आवश्यक हैं।

## Browser की सीमा

यह app VIDAA के built-in web engine पर चलता है। जिन websites ने iframe को CSP या `X-Frame-Options` से रोका है, वे embedded area में नहीं खुलेंगी। वास्तविक unrestricted browser/webview के लिए VIDAA Partner DevKit का privileged browser API चाहिए।
