<script setup lang="ts">
const supabase = useSupabaseClient();

const form = reactive({
  email: "",
  password: "",
});

const isPasswordVisible = ref(false);

const signInWithOtp = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password,
  });
  if (error) console.log(error);

  navigateTo("/confirm");
};
</script>

<template>
  <div class="max-w-96 mb-auto mx-auto">
    <AppCard class="mb-5">
      <form class="card-body" @submit.prevent="signInWithOtp">
        <AppInput v-model="form.email" type="email" label="Email" />
        <AppInput
          v-model="form.password"
          :type="isPasswordVisible ? 'test' : 'password'"
          label="Password"
          @click:append="isPasswordVisible = !isPasswordVisible"
        >
          <template #append>
            <Icon
              :name="
                isPasswordVisible
                  ? 'material-symbols-light:visibility-off'
                  : 'material-symbols-light:visibility'
              "
              class="text-xl cursor-pointer"
            ></Icon>
          </template>
        </AppInput>
        <div class="flex w-full">
          <BaseButton class="ml-auto" type="submit">
            Sign In with E-Mail
          </BaseButton>
        </div>
      </form>
    </AppCard>

    <AppCard>
      <AppCardBody>
        <p>Guest User: test@test.com</p>
        <p>Guest Password: 123</p>
      </AppCardBody>
    </AppCard>
  </div>
</template>
