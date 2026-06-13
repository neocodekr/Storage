// 다국어(i18n) - 디바이스 언어가 한국어면 한국어, 그 외에는 영어
(function () {
    const translations = {
        ko: {
            doc_title: 'Image Modify - 이미지 수정 도구',
            logo_title: '클릭하여 전체 보기',
            tab_resize: '이미지 리사이즈',
            tab_crop: '이미지 자르기',
            tab_rename: '이미지 이름변경',
            tab_compress: '이미지 압축',
            upload_main: '이미지를 클릭하거나 드래그하세요',
            upload_sub: 'PNG, JPG, GIF 등 모든 이미지 형식 지원',
            loaded_images: '📸 로드된 이미지',
            label_filename: '파일명:',
            label_size: '크기:',
            label_resolution: '해상도:',
            preview: '미리보기',
            expand_title: '레이아웃 넓히기 / 닫기',
            sec_resize: '📐 리사이즈',
            unit_px: '픽셀 (px)',
            unit_percent: '백분율 (%)',
            width: '가로:',
            height: '세로:',
            keep_ratio: '비율 유지',
            sec_crop: '✂️ 자르기',
            crop_hint: '💡 이미지 위에서 드래그하여 영역을 선택하세요',
            crop_none: '없음',
            crop_rect: '직사각형',
            crop_circle: '원형',
            crop_w: '너비:',
            crop_h: '높이:',
            sec_rename: '📝 파일명',
            use_rename: '파일명 변경 사용',
            name_single: '개별 이름',
            name_seq: '시퀀스 이름',
            new_name: '새 이름:',
            ph_no_ext: '확장자 제외',
            prefix: '접두사:',
            ph_prefix: '예: image',
            start_num: '시작 번호:',
            padding: '패딩 (자릿수):',
            seq_example: '예: image_001, image_002, ...',
            ext_label: '확장자: -',
            ext_prefix: '확장자: ',
            sec_compress: '🗜️ 압축',
            use_compress: '압축 사용',
            quality: '품질:',
            original: '원본:',
            estimated: '예상:',
            calculating: '계산 중...',
            dl_current: '⬇️ 현재 이미지',
            dl_all: '⬇️ 모두 다운로드',
            footer_tip: '💡 Tip: 모든 처리는 브라우저에서 진행되어 서버에 저장되지 않습니다.',
            alert_upload_first: '먼저 이미지를 업로드하세요.',
            compressing: '압축 중...',
            zip_generating: 'ZIP 생성 중...',
        },
        en: {
            doc_title: 'Image Modify - Image Editing Tool',
            logo_title: 'Click to view full size',
            tab_resize: 'Image Resizer',
            tab_crop: 'Image Crop',
            tab_rename: 'Image Rename',
            tab_compress: 'Image Compress',
            upload_main: 'Click or drag an image here',
            upload_sub: 'Supports PNG, JPG, GIF and all image formats',
            loaded_images: '📸 Loaded Images',
            label_filename: 'File name:',
            label_size: 'Size:',
            label_resolution: 'Resolution:',
            preview: 'Preview',
            expand_title: 'Expand layout / Close',
            sec_resize: '📐 Resize',
            unit_px: 'Pixels (px)',
            unit_percent: 'Percent (%)',
            width: 'Width:',
            height: 'Height:',
            keep_ratio: 'Keep aspect ratio',
            sec_crop: '✂️ Crop',
            crop_hint: '💡 Drag on the image to select an area',
            crop_none: 'None',
            crop_rect: 'Rectangle',
            crop_circle: 'Circle',
            crop_w: 'Width:',
            crop_h: 'Height:',
            sec_rename: '📝 File name',
            use_rename: 'Enable rename',
            name_single: 'Individual name',
            name_seq: 'Sequence name',
            new_name: 'New name:',
            ph_no_ext: 'Without extension',
            prefix: 'Prefix:',
            ph_prefix: 'e.g. image',
            start_num: 'Start number:',
            padding: 'Padding (digits):',
            seq_example: 'e.g. image_001, image_002, ...',
            ext_label: 'Extension: -',
            ext_prefix: 'Extension: ',
            sec_compress: '🗜️ Compress',
            use_compress: 'Enable compression',
            quality: 'Quality:',
            original: 'Original:',
            estimated: 'Estimated:',
            calculating: 'Calculating...',
            dl_current: '⬇️ Current image',
            dl_all: '⬇️ Download all',
            footer_tip: '💡 Tip: All processing happens in your browser; nothing is uploaded to a server.',
            alert_upload_first: 'Please upload an image first.',
            compressing: 'Compressing...',
            zip_generating: 'Generating ZIP...',
        },
    };

    // 디바이스 언어 감지 (한국어면 ko, 그 외 en)
    const rawLang = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
    const lang = rawLang.startsWith('ko') ? 'ko' : 'en';

    const dict = translations[lang];

    // 전역 번역 함수 (main.js 등에서 사용)
    window.t = function (key) {
        return (dict && dict[key]) || key;
    };
    window.currentLang = lang;

    // DOM에 번역 적용
    function applyI18n() {
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-i18n]').forEach((el) => {
            const key = el.getAttribute('data-i18n');
            if (dict[key] !== undefined) el.textContent = dict[key];
        });

        document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
        });

        document.querySelectorAll('[data-i18n-title]').forEach((el) => {
            const key = el.getAttribute('data-i18n-title');
            if (dict[key] !== undefined) el.setAttribute('title', dict[key]);
        });

        if (dict.doc_title) document.title = dict.doc_title;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyI18n);
    } else {
        applyI18n();
    }
})();
