<script setup lang="ts">
const supabase = useSupabaseClient();

const form = reactive({
  email: "",
  password: "",
});

const signInWithOtp = async () => {
  const { error } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: "123",
  });
  if (error) console.log(error);

  navigateTo("/confirm");
};
</script>

<template>
  <AppCard class="max-w-96 m-auto">
    <AppCardBody>
      <AppInput v-model="form.email" type="email" label="Email" />
      <AppInput v-model="form.password" type="password" label="Password" />
      <div class="flex w-full">
        <BaseButton class="ml-auto" @click="signInWithOtp">
          Sign In with E-Mail
        </BaseButton>
      </div>
    </AppCardBody>
  </AppCard>
</template>
