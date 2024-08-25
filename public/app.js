document.addEventListener('DOMContentLoaded', () => {
    const param = window.location.pathname;
    const slug = document.querySelector('.slug');
    console.log(param);
    
    slug.innerHTML = param.split('/')[1];
});