let blogPages = [];

async function getBlogPagesFromIndex()
{
    const response = await fetch("/blog.html");
    if (!response.ok)
    {
        throw new Error("Could not load blog index");
    }

    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    blogPages = Array.from(doc.querySelectorAll(".BlogsList > li > a.BlogElement"), (a) => a.getAttribute("href"))
        .filter(Boolean)
        .map((href) => new URL(href, window.location.origin).pathname);

    return blogPages;
}

function normalizeBlogPath(pathOrUrl)
{
    const url = new URL(pathOrUrl, window.location.origin);
    let path = url.pathname;

    // Keep comparisons consistent across "/blogs/post" and "/blogs/post/"
    if (path.length > 1 && path.endsWith("/"))
    {
        path = path.slice(0, -1);
    }

    // Treat extension and extensionless routes as the same page
    if (path.endsWith(".html"))
    {
        path = path.slice(0, -5);
    }

    return path;
}

function getCurrentBlogIndex(currentBlog)
{
    const currentPath = normalizeBlogPath(currentBlog);
    return blogPages.findIndex((blogPath) => normalizeBlogPath(blogPath) === currentPath);
}

async function ensureBlogPagesLoaded()
{
    if (blogPages.length === 0)
    {
        await getBlogPagesFromIndex();
    }
}

function updateBlogNavigationButtonVisibility(currentBlog = window.location.pathname)
{
    const navigationContainer = document.querySelector(".BlogNavigationContainer");
    if (!navigationContainer)
    {
        return;
    }

    const previousButton = navigationContainer.querySelector("a[onclick*='jumpToPreviousBlogPage']") || navigationContainer.querySelector("a:nth-of-type(1)");
    const nextButton = navigationContainer.querySelector("a[onclick*='jumpToNextBlogPage']") || navigationContainer.querySelector("a:nth-of-type(2)");

    const currentIndex = getCurrentBlogIndex(currentBlog);
    if (currentIndex === -1)
    {
        return;
    }

    const hasPrevious = currentIndex > 0;
    const hasNext = currentIndex < blogPages.length - 1;

    if (previousButton)
    {
        previousButton.style.display = hasPrevious ? "" : "none";
    }

    if (nextButton)
    {
        nextButton.style.display = hasNext ? "" : "none";
    }

    navigationContainer.style.display = (hasPrevious || hasNext) ? "" : "none";
}

document.addEventListener("DOMContentLoaded", async () =>
{
    try
    {
        await getBlogPagesFromIndex();
        updateBlogNavigationButtonVisibility();
        console.log("Loaded blog pages:", blogPages);
    }
    catch (error)
    {
        console.error("Failed to load blog pages:", error);
    }
});

async function jumpToNextBlogPage(currentBlog = window.location.pathname)
{
    await ensureBlogPagesLoaded();

    const currentIndex = getCurrentBlogIndex(currentBlog);
    if (currentIndex === -1)
    {
        console.error("Current blog page was not found in blogPages:", currentBlog);
        return;
    }

    const nextIndex = currentIndex + 1;
    if (nextIndex >= blogPages.length)
    {
        console.warn("Already on the last blog page.");
        return;
    }

    window.location.href = blogPages[nextIndex];
}

async function jumpToPreviousBlogPage(currentBlog = window.location.pathname)
{
    await ensureBlogPagesLoaded();

    const currentIndex = getCurrentBlogIndex(currentBlog);
    if (currentIndex === -1)
    {
        console.error("Current blog page was not found in blogPages:", currentBlog);
        return;
    }

    const previousIndex = currentIndex - 1;
    if (previousIndex < 0)
    {
        console.warn("Already on the first blog page.");
        return;
    }

    window.location.href = blogPages[previousIndex];
}