<template>
    <div>
        <!-- Section: Design Block -->
        <section class="text-center">
          <div class="card mx-4 mx-md-5 shadow-5-strong bg-body-tertiary" style="
                
                backdrop-filter: blur(30px);
                ">
            <div class="card-body py-5 px-md-5">
            
              <div class="row d-flex justify-content-center">
                <div class="col-lg-8">
                  <h2 class="fw-bold mb-5">Ingresa aqui</h2>
                  <form @submit.prevent="handleLogin">
                    <!-- 2 column grid layout with text inputs for the first and last names -->
                    <!-- Usuario -->
                    <div class="row">
                      <div class="col-md-12 mb-4">
                        <div class="form-outline">
                          <input type="text" id="username" class="form-control" v-model="form.username" required />
                          <label class="form-label" for="username">Usuario</label>
                          <small v-if="errors.username" class="text-danger">{{ errors.username }}</small>
                        </div>
                      </div>
                    </div>
                
                    <!-- Email -->
                    <div class="form-outline mb-4">
                      <input type="email" id="email" class="form-control" v-model="form.email" required />
                      <label class="form-label" for="email">Correo electrónico</label>
                      <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
                    </div>
                
                    <!-- Password input -->
                    <div class="form-outline mb-4">
                      <input type="password" id="password" class="form-control" v-model="form.password" required />
                      <label class="form-label" for="password">Contraseña</label>
                      <small v-if="errors.password" class="text-danger">{{ errors.password }}</small>
                    </div>
                        <!-- Submit button -->
                    <button type="button" @click="goToHome" data-mdb-button-init data-mdb-ripple-init class="btn btn-primary btn-block mb-4">
                      Iniciar sesión
                    </button>
                

                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>
        <!-- Section: Design Block -->
    </div>
</template>

<script>
import { ref } from 'vue';
import router from '../router/index.js';
export default {
  setup(){

    const form = ref({
      username: "",
      email: "",
      password: ""
    });

    const errors = ref({});
    const validateForm = () => {
      errors.value = {};

      if (!form.value.username) {
        errors.value.username = "El usuario es obligatorio";
      }

      if (!form.value.email) {
        errors.value.email = "El correo es obligatorio";
      } else if (!/\S+@\S+\.\S+/.test(form.value.email)) {
        errors.value.email = "El correo electrónico no es válido";
      }

      if (!form.value.password) {
        errors.value.password = "La contraseña es obligatoria";
      } else if (form.value.password.length < 6) {
        errors.value.password = "La contraseña debe tener al menos 6 caracteres";
      }

      return Object.keys(errors.value).length === 0;
    };

    const handleLogin = () => {
      if (validateForm()) {
        console.log("Formulario válido, enviando datos...");
        // Aquí puedes hacer una petición a un backend para autenticar al usuario
        router.push({ name: "HomeAdmin" });
      } else {
        console.log("Errores en el formulario:", errors.value);
      }
    };

    const goToHome = () => {
    router.push({ name:'HomeAdmin'})
    }
    return{
      form,
      errors,
      handleLogin,
      goToHome
    }
  }
}
    

</script>

<style lang="scss" scoped>

</style>