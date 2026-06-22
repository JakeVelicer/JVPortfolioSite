document.addEventListener("DOMContentLoaded", InitializeImageLightbox);

function InitializeImageLightbox()
{
    function IsPhotoViewerExcluded(image)
    {
        return image.matches("[data-photo-viewer='off'], [data-no-photo-viewer], .NoPhotoViewer, .PhotoViewerExclude");
    }

    const imageColumns = Array.from(document.querySelectorAll(".ImageGridColumn"));
    const imageGalleries = Array.from(document.querySelectorAll(".ImageGalleryList"));
    const standaloneZoomImages = Array.from(document.querySelectorAll(".ProjectCenterImage, .ProjectCenterImageWide")).filter((image) => image.closest(".ImageGridColumn") === null && image.closest(".ImageGalleryList") === null && !IsPhotoViewerExcluded(image));

    if (imageColumns.length === 0 && imageGalleries.length === 0 && standaloneZoomImages.length === 0)
    {
        return;
    }

    const viewer = document.createElement("div");
    viewer.className = "ImageLightbox";
    viewer.setAttribute("aria-hidden", "true");

    const viewerImage = document.createElement("img");
    viewerImage.className = "ImageLightboxImage";
    viewerImage.alt = "";

    const previousButton = document.createElement("button");
    previousButton.className = "ImageLightboxButton ImageLightboxPrev";
    previousButton.type = "button";
    previousButton.setAttribute("aria-label", "Previous image");
    previousButton.innerHTML = "&#10094;";

    const nextButton = document.createElement("button");
    nextButton.className = "ImageLightboxButton ImageLightboxNext";
    nextButton.type = "button";
    nextButton.setAttribute("aria-label", "Next image");
    nextButton.innerHTML = "&#10095;";

    const closeButton = document.createElement("button");
    closeButton.className = "ImageLightboxClose";
    closeButton.type = "button";
    closeButton.setAttribute("aria-label", "Close image viewer");
    closeButton.innerHTML = "&times;";

    viewer.appendChild(previousButton);
    viewer.appendChild(viewerImage);
    viewer.appendChild(nextButton);
    viewer.appendChild(closeButton);
    document.body.appendChild(viewer);

    let activeImages = [];
    let activeIndex = 0;
    let isOpen = false;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let currentZoom = 1;
    let panOffsetX = 0;
    let panOffsetY = 0;
    let panStartX = 0;
    let panStartY = 0;
    let panStartOffsetX = 0;
    let panStartOffsetY = 0;
    let isPanning = false;
    let activePointerId = null;
    let mousePanMoved = false;
    let pinchStartDistance = 0;
    let pinchStartZoom = 1;
    let didPinchGesture = false;

    const SWIPE_MIN_DISTANCE = 50;
    const SWIPE_MAX_VERTICAL_DRIFT = 80;
    const MIN_ZOOM = 1;
    const MAX_ZOOM = 3;
    const ZOOM_STEP = 0.2;

    function GetTouchDistance(touchA, touchB)
    {
        const deltaX = touchA.clientX - touchB.clientX;
        const deltaY = touchA.clientY - touchB.clientY;
        return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY));
    }

    function ApplyZoom()
    {
        viewerImage.style.transform = `translate(${panOffsetX}px, ${panOffsetY}px) scale(${currentZoom})`;

        if (currentZoom > 1)
        {
            viewerImage.classList.add("Zoomed");
        }
        else
        {
            viewerImage.classList.remove("Zoomed");
        }
    }

    function ResetZoom()
    {
        currentZoom = 1;
        panOffsetX = 0;
        panOffsetY = 0;
        ApplyZoom();
    }

    function StartPan(clientX, clientY, pointerId)
    {
        if (currentZoom <= 1)
        {
            return false;
        }

        isPanning = true;
        activePointerId = pointerId ?? null;
        panStartX = clientX;
        panStartY = clientY;
        panStartOffsetX = panOffsetX;
        panStartOffsetY = panOffsetY;
        mousePanMoved = false;
        viewerImage.classList.add("Panning");
        return true;
    }

    function MovePan(clientX, clientY)
    {
        if (!isPanning)
        {
            return;
        }

        panOffsetX = panStartOffsetX + (clientX - panStartX);
        panOffsetY = panStartOffsetY + (clientY - panStartY);
        if (activePointerId === "mouse" && (Math.abs(clientX - panStartX) > 2 || Math.abs(clientY - panStartY) > 2))
        {
            mousePanMoved = true;
        }
        ApplyZoom();
    }

    function EndPan()
    {
        isPanning = false;
        activePointerId = null;
        viewerImage.classList.remove("Panning");
    }

    function ChangeZoom(stepAmount)
    {
        const zoomTarget = currentZoom + stepAmount;
        currentZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoomTarget));
        ApplyZoom();
    }

    function RenderImage()
    {
        if (activeImages.length === 0)
        {
            return;
        }

        const selectedImage = activeImages[activeIndex];
        viewerImage.src = selectedImage.src;
        viewerImage.alt = selectedImage.alt || "Expanded gallery image";
        ResetZoom();
    }

    function UpdateNavigationButtons()
    {
        const hasMultipleImages = activeImages.length > 1;
        const atFirstImage = activeIndex <= 0;
        const atLastImage = activeIndex >= activeImages.length - 1;

        previousButton.style.display = hasMultipleImages && !atFirstImage ? "flex" : "none";
        nextButton.style.display = hasMultipleImages && !atLastImage ? "flex" : "none";
    }

    function OpenViewer(images, index)
    {
        activeImages = images;
        activeIndex = index;
        isOpen = true;

        RenderImage();

        viewer.classList.add("Open");
        viewer.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";

        UpdateNavigationButtons();
    }

    function CloseViewer()
    {
        isOpen = false;
        viewer.classList.remove("Open");
        viewer.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        ResetZoom();
    }

    function ShowNext()
    {
        if (!isOpen || activeImages.length <= 1 || activeIndex >= activeImages.length - 1)
        {
            return;
        }

        activeIndex += 1;
        RenderImage();
        UpdateNavigationButtons();
    }

    function ShowPrevious()
    {
        if (!isOpen || activeImages.length <= 1 || activeIndex <= 0)
        {
            return;
        }

        activeIndex -= 1;
        RenderImage();
        UpdateNavigationButtons();
    }

    imageColumns.forEach((column) => {
        const columnImages = Array.from(column.querySelectorAll("img")).filter((image) => !IsPhotoViewerExcluded(image));

        if (columnImages.length === 0)
        {
            return;
        }

        columnImages.forEach((image, index) => {
            image.addEventListener("click", () => OpenViewer(columnImages, index));
        });
    });

    imageGalleries.forEach((gallery) => {
        const galleryImages = Array.from(gallery.querySelectorAll("img")).filter((image) => !IsPhotoViewerExcluded(image));

        if (galleryImages.length === 0)
        {
            return;
        }

        galleryImages.forEach((image, index) => {
            image.addEventListener("click", () => OpenViewer(galleryImages, index));
        });
    });

    standaloneZoomImages.forEach((image) => {
        image.addEventListener("click", () => OpenViewer([image], 0));
    });

    previousButton.addEventListener("click", ShowPrevious);
    nextButton.addEventListener("click", ShowNext);
    closeButton.addEventListener("click", CloseViewer);

    viewer.addEventListener("click", (event) => {
        if (event.target === viewer)
        {
            CloseViewer();
        }
    });

    viewer.addEventListener("touchstart", (event) => {
        if (!isOpen)
        {
            return;
        }

        if (event.touches.length === 2)
        {
            pinchStartDistance = GetTouchDistance(event.touches[0], event.touches[1]);
            pinchStartZoom = currentZoom;
            didPinchGesture = false;
            return;
        }

        if (event.touches.length !== 1)
        {
            return;
        }

        if (currentZoom > 1)
        {
            const touch = event.touches[0];
            StartPan(touch.clientX, touch.clientY);
            return;
        }

        touchStartX = event.touches[0].clientX;
        touchStartY = event.touches[0].clientY;
        touchCurrentX = touchStartX;
        didPinchGesture = false;
    }, { passive: true });

    viewer.addEventListener("touchmove", (event) => {
        if (!isOpen)
        {
            return;
        }

        if (event.touches.length === 2)
        {
            event.preventDefault();
            const currentDistance = GetTouchDistance(event.touches[0], event.touches[1]);

            if (pinchStartDistance <= 0)
            {
                pinchStartDistance = currentDistance;
                pinchStartZoom = currentZoom;
                return;
            }

            const distanceRatio = currentDistance / pinchStartDistance;
            currentZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, pinchStartZoom * distanceRatio));
            ApplyZoom();

            if (Math.abs(currentDistance - pinchStartDistance) > 6)
            {
                didPinchGesture = true;
            }

            return;
        }

        if (event.touches.length !== 1)
        {
            return;
        }

        if (currentZoom > 1 && isPanning)
        {
            event.preventDefault();
            const touch = event.touches[0];
            MovePan(touch.clientX, touch.clientY);
            return;
        }

        touchCurrentX = event.touches[0].clientX;
    }, { passive: false });

    viewer.addEventListener("touchend", (event) => {
        if (!isOpen)
        {
            return;
        }

        if (event.touches.length === 0)
        {
            pinchStartDistance = 0;
        }

        if (didPinchGesture)
        {
            if (event.touches.length === 0)
            {
                didPinchGesture = false;
            }

            return;
        }

        if (isPanning)
        {
            EndPan();
            return;
        }

        if (!isOpen || activeImages.length <= 1)
        {
            return;
        }

        if (currentZoom > 1)
        {
            return;
        }

        const changedTouch = event.changedTouches[0];

        if (!changedTouch)
        {
            return;
        }

        const deltaX = touchCurrentX - touchStartX;
        const deltaY = changedTouch.clientY - touchStartY;

        if (Math.abs(deltaY) > SWIPE_MAX_VERTICAL_DRIFT)
        {
            return;
        }

        if (deltaX <= -SWIPE_MIN_DISTANCE)
        {
            ShowNext();
            return;
        }

        if (deltaX >= SWIPE_MIN_DISTANCE)
        {
            ShowPrevious();
        }
    }, { passive: true });

    viewerImage.addEventListener("click", () => {
        if (!isOpen)
        {
            return;
        }

        if (mousePanMoved)
        {
            mousePanMoved = false;
            return;
        }

        if (currentZoom > 1)
        {
            ResetZoom();
            return;
        }

        currentZoom = 2;
        ApplyZoom();
    });

    viewerImage.addEventListener("mousedown", (event) => {
        if (!isOpen || event.button !== 0)
        {
            return;
        }

        if (currentZoom <= 1)
        {
            return;
        }

        event.preventDefault();
        StartPan(event.clientX, event.clientY, "mouse");
    });

    window.addEventListener("mousemove", (event) => {
        if (!isOpen || activePointerId !== "mouse")
        {
            return;
        }

        MovePan(event.clientX, event.clientY);
    });

    window.addEventListener("mouseup", () => {
        if (activePointerId === "mouse")
        {
            EndPan();
        }
    });

    viewerImage.addEventListener("dragstart", (event) => {
        event.preventDefault();
    });

    viewerImage.addEventListener("wheel", (event) => {
        if (!isOpen)
        {
            return;
        }

        event.preventDefault();
        const step = event.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
        ChangeZoom(step);
    }, { passive: false });

    document.addEventListener("keydown", (event) => {
        if (!isOpen)
        {
            return;
        }

        if (event.key === "Escape")
        {
            CloseViewer();
            return;
        }

        if (event.key === "ArrowRight")
        {
            ShowNext();
            return;
        }

        if (event.key === "ArrowLeft")
        {
            ShowPrevious();
            return;
        }

        if (event.key === "+" || event.key === "=")
        {
            ChangeZoom(ZOOM_STEP);
            return;
        }

        if (event.key === "-" || event.key === "_")
        {
            ChangeZoom(-ZOOM_STEP);
            return;
        }

        if (event.key === "0")
        {
            ResetZoom();
        }
    });
}
