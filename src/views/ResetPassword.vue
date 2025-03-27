<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card shadow">
          <div class="card-body p-4">
            <h2 class="text-center mb-4">Restablecer contraseña</h2>
            
            <form @submit.prevent="handleSubmit">
              <div class="mb-3">
                <label for="password" class="form-label">Nueva contraseña</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="password" 
                  v-model="password"
                  required
                  minlength="6"
                >
              </div>
              
              <div class="mb-3">
                <label for="confirmPassword" class="form-label">Confirmar contraseña</label>
                <input 
                  type="password" 
                  class="form-control" 
                  id="confirmPassword" 
                  v-model="confirmPassword"
                  required
                  minlength="6"
                >
                <div v-if="error" class="text-danger mt-2">{{ error }}</div>
                <div v-if="success" class="text-success mt-2">{{ success }}</div>
              </div>
              
              <button 
                type="submit" 
                class="btn btn-primary w-100"
                :disabled="loading"
              >
                <span v-if="loading">Procesando...</span>
                <span v-else>Restablecer contraseña</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from '../utils/axios';

export default {
  setup() {
    const password = ref('');
    const confirmPassword = ref('');
    const error = ref('');
    const success = ref('');
    const loading = ref(false);
    const route = useRoute();
    const router = useRouter();

    const handleSubmit = async () => {
      if (password.value !== confirmPassword.value) {
        error.value = 'Las contraseñas no coinciden';
        return;
      }

      if (password.value.length < 6) {
        error.value = 'La contraseña debe tener al menos 6 caracteres';
        return;
      }

      error.value = '';
      loading.value = true;
      
      try {
        await axios.post(`/api/auth/reset-password/${route.params.token}`, {
          password: password.value
        });
        
        success.value = 'Contraseña actualizada correctamente. Redirigiendo...';
        setTimeout(() => router.push('/'), 2000);
      } catch (err) {
        error.value = err.response?.data?.error || 'Error al restablecer la contraseña';
      } finally {
        loading.value = false;
      }
    };

    return { password, confirmPassword, error, success, loading, handleSubmit };
  }
};
</script>