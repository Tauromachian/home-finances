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
      <div class="flex gap-4 mobile:rounded-t-md pt-4 px-7">
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

        <div class="flex gap-1 mt-4">
          <BaseButton class="ml-auto" variant="outlined" @click="model = false">
            Cancel
          </BaseButton>
          <BaseButton
            :colors="{ color: 'danger-0', hover: 'danger-1' }"
            @click="$emit('click:delete')"
          >
            Delete
          </BaseButton>
        </div>
      </AppCardBody>
    </AppCard>
  </AppDialog>
</template>
