<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Recuperar contraseña</h2>
            
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="email" class="form-label">Correo electrónico</label>
                <input 
                  type="email" 
                  class="form-control" 
                  id="email" 
                  v-model="email"
                  required
                >
                <div v-if="error" class="text-danger mt-2">{{ error }}</div>
                <div v-if="success" class="text-success mt-2">{{ success }}</div>
              </div>
              
              <button 
                type="submit" 
                class="btn btn-primary w-100"
                :disabled="loading"
              >
                <span v-if="loading">Enviando...</span>
                <span v-else>Enviar enlace</span>
              </button>
            </form>
            
            <div class="text-center mt-3">
              <router-link to="/" class="text-decoration-none">
                Volver al inicio de sesión
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import axios from '../utils/axios';

export default {
  setup() {
    const email = ref('');
    const error = ref('');
    const success = ref('');
    const loading = ref(false);

    const handleSubmit = async () => {
      error.value = '';
      success.value = '';
      loading.value = true;
      
      try {
        await axios.post('/api/auth/forgot-password', {
          correousuario: email.value
        });
        
        success.value = 'Se ha enviado un enlace de recuperación a tu correo electrónico.';
        email.value = '';
      } catch (err) {
        error.value = err.response?.data?.error || 'Error al enviar el enlace de recuperación';
      } finally {
        loading.value = false;
      }
    };

    return { email, error, success, loading, handleSubmit };
  }
};
</script>