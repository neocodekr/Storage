class ImageModifier {
    constructor() {
        this.images = [];
        this.currentIndex = -1;
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.cropOverlay = null;

        // 크롭 드래그 상태
        this.cropDragging = {
            active: false,
            type: null, // 'move', 'nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'
            startX: 0,
            startY: 0,
            startCrop: {},
        };

        this.initLogo();
        this.initResizeControls();
        this.initEventListeners();
        this.updateResizeModeUI();
    }

    initResizeControls() {
        const resizeSection = document.querySelector('.control-section[data-section="resize"]');
        if (!resizeSection || document.getElementById('percentResizeControls')) return;

        const percentControls = document.createElement('div');
        percentControls.id = 'percentResizeControls';
        percentControls.className = 'percent-resize-controls';
        percentControls.hidden = true;
        percentControls.innerHTML = `
            <div class="input-group">
                <label for="resizePercent">%</label>
                <div class="percent-input-wrap">
                    <input type="number" id="resizePercent" min="1" max="1000" value="100">
                    <span>%</span>
                </div>
            </div>
            <div class="percent-presets" aria-label="Percent presets">
                <button type="button" class="percent-preset-btn" data-percent="25">25%</button>
                <button type="button" class="percent-preset-btn" data-percent="50">50%</button>
            </div>
        `;

        resizeSection.appendChild(percentControls);
    }

    initLogo() {
        const logoCanvas = document.getElementById('logoCanvas');
        if (!logoCanvas) return;

        const ctx = logoCanvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            logoCanvas.width = 50;
            logoCanvas.height = 50;

            const scale = Math.min(50 / img.width, 50 / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const x = 0;
            const y = (50 - scaledHeight) / 2;

            ctx.clearRect(0, 0, 50, 50);
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
        };

        img.onerror = () => console.warn('로고 로드 실패');
        img.src = 'neocode_logo.png';
    }

    initEventListeners() {
        // 파일 입력
        const imageInput = document.getElementById('imageInput');
        imageInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // 드래그 앤 드롭
        const uploadBox = document.querySelector('.upload-box');
        uploadBox.addEventListener('dragover', (e) => this.handleDragOver(e));
        uploadBox.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        uploadBox.addEventListener('drop', (e) => this.handleDrop(e));

        // 리사이즈 모드
        document.querySelectorAll('input[name="resizeMode"]').forEach(radio => {
            radio.addEventListener('change', () => {
                this.updateResizeModeUI();
                this.updatePreview();
            });
        });

        document.getElementById('resizePercent').addEventListener('input', () => {
            this.updatePercentPresetState();
            this.updatePreview();
        });

        document.querySelectorAll('.percent-preset-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.getElementById('resizePercent').value = button.dataset.percent;
                this.updatePercentPresetState();
                this.updatePreview();
            });
        });

        // 리사이즈 값
        document.getElementById('resizeWidth').addEventListener('input', () => {
            if (document.getElementById('maintainAspect').checked) {
                this.updateHeightFromWidth();
            }
            this.updatePreview();
        });

        document.getElementById('resizeHeight').addEventListener('input', () => {
            if (document.getElementById('maintainAspect').checked) {
                this.updateWidthFromHeight();
            }
            this.updatePreview();
        });

        // 비율 유지
        document.getElementById('maintainAspect').addEventListener('change', () => {
            this.updatePreview();
        });

        // 크롭 모드
        document.querySelectorAll('input[name="cropMode"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const cropControls = document.getElementById('cropControls');
                const previewBox = document.querySelector('.preview-box');

                if (radio.value === 'none') {
                    cropControls.style.display = 'none';
                    previewBox.classList.add('no-crop');
                    if (this.cropOverlay) this.cropOverlay.style.display = 'none';
                } else {
                    cropControls.style.display = 'block';
                    previewBox.classList.remove('no-crop');
                    if (this.cropOverlay) {
                        this.cropOverlay.style.display = 'block';
                        this.cropOverlay.classList.add('active');
                    }
                }
                this.updatePreview();
            });
        });

        // 크롭 값 입력
        ['cropX', 'cropY', 'cropW', 'cropH'].forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.updateCropOverlay();
                this.updatePreview();
            });
        });

        // 파일명 변경 사용 여부
        document.getElementById('enableRename').addEventListener('change', (e) => {
            document.getElementById('renameOptions').style.display =
                e.target.checked ? 'block' : 'none';
        });

        // 파일명 모드
        document.querySelectorAll('input[name="nameMode"]').forEach(radio => {
            radio.addEventListener('change', () => {
                const singleMode = document.getElementById('singleNameMode');
                const sequenceMode = document.getElementById('sequenceNameMode');

                if (radio.value === 'single') {
                    singleMode.style.display = 'block';
                    sequenceMode.style.display = 'none';
                } else {
                    singleMode.style.display = 'none';
                    sequenceMode.style.display = 'block';
                }
            });
        });

        // 압축
        document.getElementById('enableCompress').addEventListener('change', (e) => {
            document.getElementById('compressOptions').style.display =
                e.target.checked ? 'block' : 'none';
            this.updatePreview();
            if (e.target.checked) this.scheduleEstimate();
        });

        document.getElementById('compressQuality').addEventListener('input', (e) => {
            document.getElementById('qualityValue').textContent = e.target.value + '%';
            this.scheduleEstimate();
        });

        // 다운로드
        document.getElementById('downloadBtn').addEventListener('click', () => this.downloadSingle());
        document.getElementById('downloadAllBtn').addEventListener('click', () => this.downloadAll());

        // 전체화면 토글 (하단 중앙 화살표 버튼)
        document.getElementById('expandBtn').addEventListener('click', () => this.toggleFullscreen());

        // ESC 키로 전체화면 종료
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.exitFullscreen();
            }
        });

        // 탭 버튼
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleTabClick(e));
        });

        // 기능 박스 제목 클릭 시 접기/펼치기 토글
        document.querySelectorAll('.control-section > h3').forEach(header => {
            header.addEventListener('click', () => {
                const section = header.parentElement;
                section.classList.toggle('collapsed');
            });
        });

        // 전역 마우스 이벤트
        document.addEventListener('mousemove', (e) => this.handleCropMouseMove(e));
        document.addEventListener('mouseup', (e) => this.handleCropMouseUp(e));
    }

    handleDragOver(e) {
        e.preventDefault();
        e.stopPropagation();
        document.querySelector('.upload-box').classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        e.stopPropagation();
        document.querySelector('.upload-box').classList.remove('dragover');
    }

    handleDrop(e) {
        e.preventDefault();
        e.stopPropagation();
        document.querySelector('.upload-box').classList.remove('dragover');

        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
        if (files.length > 0) {
            this.handleFileSelect({ target: { files } });
        }
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files).filter(f => f.type.startsWith('image/'));
        if (files.length === 0) return;

        this.track('image_upload', { count: files.length });

        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const imageObj = {
                        file,
                        element: img,
                        width: img.width,
                        height: img.height,
                        name: this.getFileNameWithoutExt(file.name),
                        ext: this.getFileExtension(file.name),
                    };
                    this.images.push(imageObj);

                    if (this.currentIndex === -1) {
                        this.selectImage(0);
                    } else {
                        this.updateImageList();
                    }
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    getFileNameWithoutExt(filename) {
        return filename.substring(0, filename.lastIndexOf('.'));
    }

    getFileExtension(filename) {
        return filename.substring(filename.lastIndexOf('.') + 1).toLowerCase();
    }

    selectImage(index) {
        if (index < 0 || index >= this.images.length) return;

        this.currentIndex = index;
        this.updateImageList();
        this.updateImageInfo(this.images[index]);

        document.getElementById('imageListSection').style.display = 'block';
        document.getElementById('editorSection').style.display = 'flex';
        document.body.classList.add('has-images');

        // 초기값 설정
        const img = this.images[index];
        document.getElementById('resizeWidth').value = img.width;
        document.getElementById('resizeHeight').value = img.height;
        document.getElementById('resizePercent').value = 100;
        document.getElementById('newFileName').value = img.name;

        // 크롭 초기값
        document.getElementById('cropX').value = 0;
        document.getElementById('cropY').value = 0;
        document.getElementById('cropW').value = Math.min(200, img.width);
        document.getElementById('cropH').value = Math.min(200, img.height);

        this.initCropOverlay();
        this.updatePreview();

        // 현재 활성 탭의 기능 섹션 표시
        const activeTab = document.querySelector('.tab-btn.active');
        const feature = activeTab ? activeTab.dataset.feature : 'resize';
        this.showFeatureSection(feature);

        // 압축이 켜져 있으면 예상 용량 갱신
        if (document.getElementById('enableCompress').checked) {
            this.scheduleEstimate();
        }
    }

    updateImageList() {
        const listContainer = document.getElementById('imageList');
        listContainer.innerHTML = '';

        this.images.forEach((img, index) => {
            const div = document.createElement('div');
            div.className = `image-item ${index === this.currentIndex ? 'active' : ''}`;

            const canvas = document.createElement('canvas');
            canvas.width = 80;
            canvas.height = 80;
            const ctx = canvas.getContext('2d');

            const scale = Math.min(80 / img.width, 80 / img.height);
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const x = (80 - scaledWidth) / 2;
            const y = (80 - scaledHeight) / 2;

            ctx.fillStyle = '#f3f4f6';
            ctx.fillRect(0, 0, 80, 80);
            ctx.drawImage(img.element, x, y, scaledWidth, scaledHeight);

            const indexDiv = document.createElement('div');
            indexDiv.className = 'image-item-index';
            indexDiv.textContent = index + 1;

            div.appendChild(canvas);
            div.appendChild(indexDiv);

            div.addEventListener('click', () => this.selectImage(index));
            listContainer.appendChild(div);
        });
    }

    updateImageInfo(imageObj) {
        document.getElementById('fileName').textContent = imageObj.file.name;
        document.getElementById('fileSize').textContent = this.formatFileSize(imageObj.file.size);
        document.getElementById('resolution').textContent =
            `${imageObj.width} × ${imageObj.height}`;
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }

    initCropOverlay() {
        // 크롭 오버레이는 캔버스를 감싸는 wrapper 안에 위치시켜 렌더링 크기에 정확히 정렬
        const wrapper = document.querySelector('.canvas-wrapper');
        const existing = wrapper.querySelector('#cropOverlay');
        if (existing) existing.remove();

        this.cropOverlay = document.createElement('div');
        this.cropOverlay.id = 'cropOverlay';
        this.cropOverlay.className = 'rectangle';

        const cropMode = document.querySelector('input[name="cropMode"]:checked').value;
        if (cropMode !== 'none') {
            this.cropOverlay.classList.add('active');
        }

        // 핸들 생성
        const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];
        handles.forEach(handle => {
            const div = document.createElement('div');
            div.className = `crop-handle ${handle}`;
            this.cropOverlay.appendChild(div);
        });

        wrapper.appendChild(this.cropOverlay);

        // 크롭 오버레이 이벤트
        this.cropOverlay.addEventListener('mousedown', (e) => this.handleCropMouseDown(e));
    }

    handleCropMouseDown(e) {
        const cropMode = document.querySelector('input[name="cropMode"]:checked').value;
        if (cropMode === 'none') return;

        const target = e.target;
        const isHandle = target.classList.contains('crop-handle');
        const isOverlay = target === this.cropOverlay;

        if (!isHandle && !isOverlay) return;

        const cropX = parseInt(document.getElementById('cropX').value) || 0;
        const cropY = parseInt(document.getElementById('cropY').value) || 0;
        const cropW = parseInt(document.getElementById('cropW').value) || 200;
        const cropH = parseInt(document.getElementById('cropH').value) || 200;

        this.cropDragging.active = true;
        this.cropDragging.startX = e.clientX;
        this.cropDragging.startY = e.clientY;
        this.cropDragging.startCrop = { cropX, cropY, cropW, cropH };

        if (isHandle) {
            const handleClass = Array.from(target.classList).find(c =>
                ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].includes(c)
            );
            this.cropDragging.type = handleClass;
        } else {
            this.cropDragging.type = 'move';
        }

        e.preventDefault();
    }

    handleCropMouseMove(e) {
        if (!this.cropDragging.active || !this.cropOverlay) return;

        const canvas = this.canvas;
        const img = this.images[this.currentIndex];

        const deltaX = e.clientX - this.cropDragging.startX;
        const deltaY = e.clientY - this.cropDragging.startY;

        // 화면 픽셀 이동량 → 이미지 픽셀로 변환 (렌더링 크기 기준)
        const renderedW = canvas.clientWidth || canvas.width;
        const renderedH = canvas.clientHeight || canvas.height;
        const scaleX = img.width / renderedW;
        const scaleY = img.height / renderedH;

        const startCrop = this.cropDragging.startCrop;
        let newCrop = { ...startCrop };

        if (this.cropDragging.type === 'move') {
            // 전체 이동
            newCrop.cropX = Math.max(0, Math.min(startCrop.cropX + Math.round(deltaX * scaleX), img.width - startCrop.cropW));
            newCrop.cropY = Math.max(0, Math.min(startCrop.cropY + Math.round(deltaY * scaleY), img.height - startCrop.cropH));
        } else {
            // 핸들 드래그로 크기 조절
            const dx = Math.round(deltaX * scaleX);
            const dy = Math.round(deltaY * scaleY);

            if (this.cropDragging.type.includes('n')) {
                newCrop.cropY = Math.max(0, startCrop.cropY + dy);
                newCrop.cropH = Math.max(10, startCrop.cropH - dy);
            }
            if (this.cropDragging.type.includes('s')) {
                newCrop.cropH = Math.max(10, startCrop.cropH + dy);
            }
            if (this.cropDragging.type.includes('w')) {
                newCrop.cropX = Math.max(0, startCrop.cropX + dx);
                newCrop.cropW = Math.max(10, startCrop.cropW - dx);
            }
            if (this.cropDragging.type.includes('e')) {
                newCrop.cropW = Math.max(10, startCrop.cropW + dx);
            }

            // 범위 체크
            newCrop.cropX = Math.max(0, Math.min(newCrop.cropX, img.width - 10));
            newCrop.cropY = Math.max(0, Math.min(newCrop.cropY, img.height - 10));
            newCrop.cropW = Math.min(newCrop.cropW, img.width - newCrop.cropX);
            newCrop.cropH = Math.min(newCrop.cropH, img.height - newCrop.cropY);
        }

        document.getElementById('cropX').value = newCrop.cropX;
        document.getElementById('cropY').value = newCrop.cropY;
        document.getElementById('cropW').value = newCrop.cropW;
        document.getElementById('cropH').value = newCrop.cropH;

        this.updateCropOverlay();
        this.updatePreview();
    }

    handleCropMouseUp(e) {
        this.cropDragging.active = false;
    }

    updateCropOverlay() {
        if (!this.cropOverlay) return;

        const cropMode = document.querySelector('input[name="cropMode"]:checked').value;
        if (cropMode === 'none') {
            this.cropOverlay.style.display = 'none';
            return;
        }

        const canvas = this.canvas;
        const img = this.images[this.currentIndex];

        // 렌더링된(화면에 보이는) 캔버스 크기 기준으로 오버레이 정렬
        const renderedW = canvas.clientWidth || canvas.width;
        const renderedH = canvas.clientHeight || canvas.height;
        const scaleX = renderedW / img.width;
        const scaleY = renderedH / img.height;

        const x = parseInt(document.getElementById('cropX').value) || 0;
        const y = parseInt(document.getElementById('cropY').value) || 0;
        const w = parseInt(document.getElementById('cropW').value) || 200;
        const h = parseInt(document.getElementById('cropH').value) || 200;

        this.cropOverlay.style.display = 'block';
        this.cropOverlay.style.left = (x * scaleX) + 'px';
        this.cropOverlay.style.top = (y * scaleY) + 'px';
        this.cropOverlay.style.width = (w * scaleX) + 'px';
        this.cropOverlay.style.height = (h * scaleY) + 'px';
        this.cropOverlay.className = cropMode;
        if (cropMode !== 'none') {
            this.cropOverlay.classList.add('active');
        }
    }

    updateResizeModeUI() {
        const resizeMode = document.querySelector('input[name="resizeMode"]:checked').value;
        const isPercent = resizeMode === 'percent';
        const pixelControls = [
            document.getElementById('resizeWidth')?.closest('.input-group'),
            document.getElementById('resizeHeight')?.closest('.input-group'),
            document.getElementById('maintainAspect')?.closest('.checkbox'),
        ];
        const percentControls = document.getElementById('percentResizeControls');

        pixelControls.forEach(control => {
            if (control) control.style.display = isPercent ? 'none' : '';
        });

        if (percentControls) {
            percentControls.hidden = !isPercent;
        }

        if (isPercent) {
            this.updatePercentPresetState();
        }
    }

    updatePercentPresetState() {
        const percent = parseFloat(document.getElementById('resizePercent').value);
        document.querySelectorAll('.percent-preset-btn').forEach(button => {
            button.classList.toggle('active', percent === parseFloat(button.dataset.percent));
        });
    }

    getResizePercent() {
        const value = parseFloat(document.getElementById('resizePercent').value);
        return Number.isFinite(value) && value > 0 ? value : 100;
    }

    updateHeightFromWidth() {
        const width = parseFloat(document.getElementById('resizeWidth').value);
        const img = this.images[this.currentIndex];
        const aspectRatio = img.height / img.width;
        document.getElementById('resizeHeight').value = Math.round(width * aspectRatio);
    }

    updateWidthFromHeight() {
        const height = parseFloat(document.getElementById('resizeHeight').value);
        const img = this.images[this.currentIndex];
        const aspectRatio = img.width / img.height;
        document.getElementById('resizeWidth').value = Math.round(height * aspectRatio);
    }

    updatePreview() {
        if (this.currentIndex < 0) return;

        const img = this.images[this.currentIndex];
        const resized = this.resizeImage(img);

        // 미리보기에는 항상 전체(리사이즈된) 이미지를 표시하고,
        // 잘릴 영역은 오버레이로 표시한다. 실제 자르기는 다운로드 시 적용.
        this.canvas.width = resized.width;
        this.canvas.height = resized.height;
        this.ctx.drawImage(resized.canvas, 0, 0);

        this.updateCropOverlay();
    }

    resizeImage(img) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        let width = img.width;
        let height = img.height;

        const resizeMode = document.querySelector('input[name="resizeMode"]:checked').value;

        if (resizeMode === 'pixels') {
            const inputWidth = parseFloat(document.getElementById('resizeWidth').value);
            const inputHeight = parseFloat(document.getElementById('resizeHeight').value);
            width = Number.isFinite(inputWidth) && inputWidth > 0 ? Math.round(inputWidth) : img.width;
            height = Number.isFinite(inputHeight) && inputHeight > 0 ? Math.round(inputHeight) : img.height;
        } else {
            const percent = this.getResizePercent();
            width = Math.max(1, Math.round(img.width * percent / 100));
            height = Math.max(1, Math.round(img.height * percent / 100));
        }

        tempCanvas.width = width;
        tempCanvas.height = height;
        tempCtx.drawImage(img.element, 0, 0, width, height);

        return { width, height, canvas: tempCanvas };
    }

    cropImage(resized, originalImg) {
        const cropMode = document.querySelector('input[name="cropMode"]:checked').value;

        if (cropMode === 'none') {
            return resized;
        }

        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');

        let x = parseInt(document.getElementById('cropX').value) || 0;
        let y = parseInt(document.getElementById('cropY').value) || 0;
        let w = parseInt(document.getElementById('cropW').value) || originalImg.width;
        let h = parseInt(document.getElementById('cropH').value) || originalImg.height;

        const scaleX = resized.width / originalImg.width;
        const scaleY = resized.height / originalImg.height;

        x = Math.round(x * scaleX);
        y = Math.round(y * scaleY);
        w = Math.round(w * scaleX);
        h = Math.round(h * scaleY);

        tempCanvas.width = w;
        tempCanvas.height = h;

        if (cropMode === 'rectangle') {
            tempCtx.drawImage(resized.canvas, x, y, w, h, 0, 0, w, h);
        } else if (cropMode === 'circle') {
            tempCtx.clearRect(0, 0, w, h);
            tempCtx.beginPath();
            tempCtx.arc(w / 2, h / 2, Math.min(w, h) / 2, 0, Math.PI * 2);
            tempCtx.clip();
            tempCtx.drawImage(resized.canvas, x, y, w, h, 0, 0, w, h);
        }

        return { width: w, height: h, canvas: tempCanvas };
    }

    getFileName(index) {
        const img = this.images[index];

        // 파일명 변경 미사용 시 원본 이름 유지
        if (!document.getElementById('enableRename').checked) {
            return img.name;
        }

        const nameMode = document.querySelector('input[name="nameMode"]:checked').value;

        if (nameMode === 'single') {
            const customName = document.getElementById('newFileName').value;
            return customName || img.name;
        } else {
            const prefix = document.getElementById('sequencePrefix').value || 'image';
            const start = parseInt(document.getElementById('sequenceStart').value) || 1;
            const padding = parseInt(document.getElementById('sequencePadding').value) || 3;
            const number = (start + index).toString().padStart(padding, '0');
            return `${prefix}_${number}`;
        }
    }

    // 최종 이미지를 처리(리사이즈+크롭)한 canvas 생성
    buildFinalCanvas(img) {
        const resized = this.resizeImage(img);
        const cropped = this.cropImage(resized, img);

        const finalCanvas = document.createElement('canvas');
        finalCanvas.width = cropped.width;
        finalCanvas.height = cropped.height;
        const finalCtx = finalCanvas.getContext('2d');
        finalCtx.drawImage(cropped.canvas, 0, 0);

        return finalCanvas;
    }

    // 압축하여 Blob 생성 (TinyPNG 방식: PNG는 색상 양자화, JPEG/WebP는 품질 조정)
    compressToBlob(canvas, ext, enableCompress, quality) {
        return new Promise((resolve) => {
            const isPng = ext === 'png';

            // 압축 OFF: 원본 포맷 그대로 (무손실)
            if (!enableCompress) {
                canvas.toBlob((blob) => resolve(blob), `image/${ext}`, 0.95);
                return;
            }

            // PNG → UPNG.js로 색상 양자화 (TinyPNG와 동일한 pngquant 방식)
            if (isPng && typeof UPNG !== 'undefined') {
                try {
                    const ctx = canvas.getContext('2d');
                    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

                    // 품질(10~100%)을 색상 수(2~256)로 매핑 → 색상이 적을수록 용량 감소
                    const cnum = Math.max(2, Math.round(256 * quality));

                    const pngArrayBuffer = UPNG.encode(
                        [imgData.data.buffer],
                        canvas.width,
                        canvas.height,
                        cnum
                    );
                    resolve(new Blob([pngArrayBuffer], { type: 'image/png' }));
                    return;
                } catch (err) {
                    console.warn('UPNG 압축 실패, JPEG로 대체:', err);
                }
            }

            // JPEG/WebP 등 손실 포맷 → 품질 파라미터 적용
            // PNG인데 라이브러리가 없으면 JPEG로 변환하여 용량 감소
            const outputType = isPng ? 'image/jpeg' : `image/${ext}`;
            canvas.toBlob((blob) => resolve(blob), outputType, quality);
        });
    }

    // 압축 시 PNG가 JPEG로 대체될 경우 확장자 보정
    resolveExtension(ext, enableCompress) {
        if (enableCompress && ext === 'png' && typeof UPNG === 'undefined') {
            return 'jpg';
        }
        return ext;
    }

    async downloadSingle() {
        if (this.currentIndex < 0) {
            alert(this.tr('alert_upload_first'));
            return;
        }

        const img = this.images[this.currentIndex];
        const finalCanvas = this.buildFinalCanvas(img);

        const enableCompress = document.getElementById('enableCompress').checked;
        const quality = parseInt(document.getElementById('compressQuality').value) / 100;

        const blob = await this.compressToBlob(finalCanvas, img.ext, enableCompress, quality);

        const fileName = this.getFileName(this.currentIndex);
        const outExt = this.resolveExtension(img.ext, enableCompress);
        this.downloadBlob(blob, `${fileName}.${outExt}`);

        const cropMode = document.querySelector('input[name="cropMode"]:checked').value;
        this.track('download_single', {
            format: outExt,
            compressed: enableCompress,
            crop_mode: cropMode,
        });

        // 압축 결과 안내
        if (enableCompress) {
            const origSize = img.file.size;
            const ratio = ((1 - blob.size / origSize) * 100).toFixed(1);
            console.log(`압축: ${this.formatFileSize(origSize)} → ${this.formatFileSize(blob.size)} (${ratio}% 감소)`);
        }
    }

    async downloadAll() {
        if (this.images.length === 0) {
            alert(this.tr('alert_upload_first'));
            return;
        }

        // 이미지가 1장이면 그냥 단일 다운로드
        if (this.images.length === 1) {
            const img = this.images[0];
            const enableCompress = document.getElementById('enableCompress').checked;
            const quality = parseInt(document.getElementById('compressQuality').value) / 100;
            const finalCanvas = this.buildFinalCanvas(img);
            const blob = await this.compressToBlob(finalCanvas, img.ext, enableCompress, quality);
            const outExt = this.resolveExtension(img.ext, enableCompress);
            this.downloadBlob(blob, `${this.getFileName(0)}.${outExt}`);
            return;
        }

        // JSZip 미로드 시 개별 다운로드로 폴백
        if (typeof JSZip === 'undefined') {
            console.warn('JSZip 미로드 - 개별 다운로드로 진행');
            return this.downloadAllSeparately();
        }

        const enableCompress = document.getElementById('enableCompress').checked;
        const quality = parseInt(document.getElementById('compressQuality').value) / 100;

        const btn = document.getElementById('downloadAllBtn');
        const originalLabel = btn.textContent;
        btn.disabled = true;

        const zip = new JSZip();
        const usedNames = {};

        for (let index = 0; index < this.images.length; index++) {
            btn.textContent = `${this.tr('compressing')} (${index + 1}/${this.images.length})`;

            const img = this.images[index];
            const finalCanvas = this.buildFinalCanvas(img);
            const blob = await this.compressToBlob(finalCanvas, img.ext, enableCompress, quality);

            const outExt = this.resolveExtension(img.ext, enableCompress);
            let filename = `${this.getFileName(index)}.${outExt}`;

            // 동일 파일명 충돌 방지
            if (usedNames[filename]) {
                usedNames[filename]++;
                filename = `${this.getFileName(index)}_${usedNames[filename]}.${outExt}`;
            } else {
                usedNames[filename] = 1;
            }

            zip.file(filename, blob);
        }

        btn.textContent = this.tr('zip_generating');
        const zipBlob = await zip.generateAsync({ type: 'blob' });

        const stamp = new Date().toISOString().slice(0, 10);
        this.downloadBlob(zipBlob, `images_${stamp}.zip`);

        this.track('download_zip', {
            count: this.images.length,
            compressed: enableCompress,
        });

        btn.disabled = false;
        btn.textContent = originalLabel;
    }

    // 폴백: ZIP 라이브러리 없을 때 개별 다운로드
    async downloadAllSeparately() {
        const enableCompress = document.getElementById('enableCompress').checked;
        const quality = parseInt(document.getElementById('compressQuality').value) / 100;

        for (let index = 0; index < this.images.length; index++) {
            const img = this.images[index];
            const finalCanvas = this.buildFinalCanvas(img);
            const blob = await this.compressToBlob(finalCanvas, img.ext, enableCompress, quality);
            const outExt = this.resolveExtension(img.ext, enableCompress);
            this.downloadBlob(blob, `${this.getFileName(index)}.${outExt}`);
            await new Promise((r) => setTimeout(r, 200));
        }
    }

    // 예상 용량 계산 (디바운스)
    scheduleEstimate() {
        clearTimeout(this._estimateTimer);
        this._estimateTimer = setTimeout(() => this.updateCompressEstimate(), 300);
    }

    async updateCompressEstimate() {
        if (this.currentIndex < 0) return;
        if (!document.getElementById('enableCompress').checked) return;

        const img = this.images[this.currentIndex];
        const estOriginal = document.getElementById('estOriginal');
        const estCompressed = document.getElementById('estCompressed');

        estOriginal.textContent = this.formatFileSize(img.file.size);
        estCompressed.textContent = this.tr('calculating');
        estCompressed.className = '';

        const finalCanvas = this.buildFinalCanvas(img);
        const quality = parseInt(document.getElementById('compressQuality').value) / 100;
        const blob = await this.compressToBlob(finalCanvas, img.ext, true, quality);

        const ratio = ((1 - blob.size / img.file.size) * 100).toFixed(1);
        estCompressed.textContent = `${this.formatFileSize(blob.size)} (${ratio > 0 ? '-' : '+'}${Math.abs(ratio)}%)`;
        estCompressed.className = blob.size < img.file.size ? 'reduced' : 'increased';
    }

    // 번역 헬퍼 (i18n.js의 전역 t 사용)
    tr(key) {
        return typeof window.t === 'function' ? window.t(key) : key;
    }

    // Firebase Analytics 이벤트 기록 (전역 헬퍼가 있을 때만)
    track(eventName, params = {}) {
        if (typeof window.trackEvent === 'function') {
            window.trackEvent(eventName, params);
        }
    }

    downloadBlob(blob, filename) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // 미리보기 창을 크게 확장 토글 (페이지 내에서 미리보기 영역만 넓어짐)
    toggleFullscreen() {
        if (this.currentIndex < 0) return;

        const editor = document.getElementById('editorSection');
        editor.classList.toggle('preview-expanded');

        // 캔버스 렌더링 크기가 바뀌므로 크롭 오버레이 재정렬
        requestAnimationFrame(() => this.updateCropOverlay());
    }

    exitFullscreen() {
        const editor = document.getElementById('editorSection');
        if (editor.classList.contains('preview-expanded')) {
            editor.classList.remove('preview-expanded');
            requestAnimationFrame(() => this.updateCropOverlay());
        }
    }

    handleTabClick(e) {
        const feature = e.currentTarget.dataset.feature;

        // 모든 탭 버튼에서 active 클래스 제거
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // 클릭된 탭에 active 클래스 추가
        e.currentTarget.classList.add('active');

        this.showFeatureSection(feature);
    }

    showFeatureSection(feature) {
        // 모든 박스는 표시하되, 선택된 기능만 펼치고 나머지는 접기
        document.querySelectorAll('.control-section').forEach(section => {
            section.style.display = 'block';
            if (section.dataset.section === feature) {
                section.classList.remove('collapsed');
                section.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                section.classList.add('collapsed');
            }
        });
    }
}

// 초기화
document.addEventListener('DOMContentLoaded', () => {
    new ImageModifier();
});
