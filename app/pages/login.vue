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
  <div class="max-w-96 mb-auto mx-auto">
    <AppCard class="mb-5">
      <form class="card-body" @submit.prevent="signInWithOtp">
        <AppInput v-model="form.email" type="email" label="Email" />
        <AppInput v-model="form.password" type="password" label="Password" />
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
