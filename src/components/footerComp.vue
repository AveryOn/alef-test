<template>
    <footer class="footer">
        <span class="info-copyright">all rights reserved</span>
    </footer>
</template>

<style scoped>
.footer {
    width: 100%;
    height: 11%;
    margin-top: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--footer-bg);
    transition: color 0.2s, background-color 0.2s;
}
.info-copyright {
    font-family: var(--font);
    font-weight: 400;
    font-size: 13px
}
</style>