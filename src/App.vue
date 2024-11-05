<template>
    <div class="content">
        <router-view />
    </div>
</template>

<style lang="scss">
    @import url('https://fonts.googleapis.com/css2?family=Acme&family=Amatic+SC:wght@400;700&family=Dancing+Script:wght@400..700&family=Lobster&family=Luckiest+Guy&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Updock&display=swap');

    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
        list-style: none;
        resize: none;
        font-family: "Roboto", sans-serif;
        text-decoration: none;
    }

    body {
        background-color: #c4d3f6;
    }

    .content{
        max-width: 90vw;
        margin: auto;
    }
</style>
