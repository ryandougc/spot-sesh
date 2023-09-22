<template>
    <div class="profile-picture-container">
        <div 
            class="profile-picture-container__img" 
            :style="`background-image:url('${ profilePictureUrl }')`"
        ></div>
    </div>
</template>

<script>
export default {
    props: {
        profilePictureUrl: String
    }
}
</script>

<style lang="scss" scoped>
.profile-picture-container {
  width: 50px;
  height: 50px;

  border-radius: 50px;

  display: flex;
  justify-content: center;
  align-items: center;

  overflow: hidden;

  &__img {
    width:100%;
    height: 50px;
    position:relative;
    background:url() 50% 50% no-repeat;
    background-size:cover;
    background-clip:content-box;
  }

  &__img:before {
    display:block;
    content:"";
    padding-top:75%;
  }
}
</style>