window.onload = function() {
    const gallery = document.querySelector('.gallery');
    const previewImg = document.querySelector('.preview-img img');
    let imagesLoaded = 0;

    // 이미지가 모두 로드될 때까지 대기
    const totalImages = 100;
    const imgList = [];

    for (let i = 0; i < totalImages; i++) {
        const img = new Image();
        img.src = `./asset/img${(i % 10) + 1}.jpg`;
        img.onload = () => {
            imagesLoaded++;
            if (imagesLoaded === totalImages) {
                startAnimation();  // 모든 이미지가 로드되면 애니메이션 시작
            }
        };
        imgList.push(img);
    }

    function startAnimation() {
        document.addEventListener('mousemove', function(e) {
            const x = e.clientX;
            const y = e.clientY;

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;

            const rotateX = 22 + percentY * 2;
            const rotateY = percentX * 2;

            gsap.to(gallery, {
                duration: 1,
                ease: 'power2.out',
                rotateX: rotateX,
                rotateY: rotateY,
                overwrite: 'auto',
            });
        });

        for(let i = 0; i < totalImages; i++) {
            const item = document.createElement('div');
            item.classList.add('item');

            const img = imgList[i];  // 이미 로드된 이미지 사용
            item.appendChild(img);
            gallery.appendChild(item);
        }

        const items = document.querySelectorAll('.item');
        const numberOfItems = items.length;
        const angleIncrement = 360 / numberOfItems;

        items.forEach((item, index) => {
            gsap.to(item, {
                rotationY: 90,
                rotationZ: angleIncrement * index - 90,
                transformOrigin: '50% 400px',
                duration: 3.7 - index * 0.008,
            });

            item.addEventListener('mouseover', function() {
                const imgInsideItem = item.querySelector('img');
                previewImg.src = imgInsideItem.src;

                gsap.to(item, {
                    x: 10,
                    z: 10,
                    y: 10,
                    ease: 'power2.out',
                    duration: 0.5
                });
            });

            item.addEventListener('mouseout', function() {
                previewImg.src = './asset/img1.jpg';
                gsap.to(item, {
                    x: 0,
                    z: 0,
                    y: 0,
                    ease: 'power2.out',
                    duration: 0.5
                });
            });
        });

        ScrollTrigger.create({
            trigger: 'body',
            start: 'top top',
            end: 'bottom bottom',
            scrub: 2,
            onRefresh: setupRotation,
            onUpdate: self => {
                const rotationProgress = self.progress * 360 * 1;

                items.forEach((item, index) => {
                    const currentAngle = index * angleIncrement - 90 + rotationProgress;

                    gsap.to(item, {
                        rotationZ: currentAngle,
                        duration: 1,
                        ease: 'power3.out',
                        overwrite: 'auto'
                    });
                });
            }
        });
    }

    function setupRotation() {}
};