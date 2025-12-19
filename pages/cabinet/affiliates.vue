<template>
  <div class="refferal pt-3">
    <div class="px-3 ">
      <Earned />
    </div>

    <div class="flex px-2 mt-2 wrapper">
      <div class="flex flex-col pb-5 w-full">
        <how-it-works />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Components
import Earned from "~/components/refferal/Earned.vue";
import HowItWorks from "~/components/refferal/HowItWorks.vue";

// Composables
const { t } = useI18n()
const { $utils } = useNuxtApp()

// Layout
definePageMeta({
  layout: 'inner',
  auth: true
})

// Head configuration
useHead({
  title: $utils.hostToTitle?.(window?.location?.host)
})
</script>

<style scoped>
.refferal {
  min-height: calc(100vh - 2rem);
}

.page-title {
  font-family: 'Inter', ui-sans-serif, system-ui, sans-serif;
}

/* Custom breakpoint for referral layout */
@media screen and (max-width: 750px) {
  .refferal {
    .wrapper {
      @apply flex-wrap;

      .left-column {
        @apply min-w-full;
      }
    }
  }
}

/* Expanded sidebar responsive design */
:global(.cabinet:not(.cabinet_mobile).sidebar_expanded) {
  @media screen and (max-width: calc(1015px + 320px - 125px)) {
    .refferal {
      .wrapper {
        @apply border-b-0;

        .left-column {
          @apply pr-0 border-r-0;
        }

        .right-column {
          @apply pl-0;
        }
      }
    }
  }
}

/* Standard mobile breakpoint */
@media screen and (max-width: 1015px) {
  .refferal {
    .wrapper {
      @apply border-b-0;

      .left-column {
        @apply pr-0 border-r-0;
      }

      .right-column {
        @apply pl-0;
      }
    }
  }
}

/* Small mobile devices */
@media screen and (max-width: 480px) {
  .refferal {
    .px-2 {
      @apply px-1;
    }

    .page-title {
      @apply text-base mb-1;
    }
  }
}

/* Animation for page transition */
.refferal {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Ensure proper spacing for inner layout */
:global(.inner-layout) {
  .refferal {
    @apply pb-6;
  }
}

/* Dark mode support */
:global(.dark) {
  .refferal {
    @apply bg-raisin-black;
  }
}

</style>
