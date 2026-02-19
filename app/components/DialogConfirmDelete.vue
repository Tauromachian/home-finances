<script setup>
defineEmits(["click:delete"]);

const model = defineModel({
  type: Boolean,
  default: false,
});
</script>

<template>
  <AppDialog v-model="model">
    <AppCard>
      <div class="bg-teal-50 flex gap-4 mobile:rounded-t-md py-5 px-7">
        <div class="my-auto">
          <span class="font-bold block text-lg">
            Are you sure you want to delete this resource?
          </span>
        </div>
      </div>

      <AppCardBody>
        <p>
          The resource will be deleted permanently. This action is irreversible.
        </p>

        <div class="flex gap-1 mt-2">
          <BaseButton class="ml-auto" @click="model = false">
            Cancel
          </BaseButton>
          <BaseButton color="red" @click="$emit('click:delete')">
            Delete
          </BaseButton>
        </div>
      </AppCardBody>
    </AppCard>
  </AppDialog>
</template>
