<template>
  <AppCard class="HowItWorks">
    <!-- Header Section -->
    <div class="howitworks-header flex justify-between items-center mb-8 flex-wrap gap-4">
      <h2 class="section-title text-2xl font-bold text-color">
        {{ t('how_it_works') }}
      </h2>
      <div class="total-members-card bg-secondary px-4 py-4 rounded-lg border border-border text-center">
        <p class="members-label text-sm text-gray uppercase tracking-wider mb-1">
          {{ t('total_members') }}
        </p>
        <p class="members-count text-2xl font-bold text-blue">
          {{ total }}
        </p>
      </div>
    </div>

    <!-- Referral Flow Visualization -->
    <div class="referral-flow flex items-start gap-0 mb-8 overflow-x-auto py-2">
      <!-- You (Starting Point) -->
      <div class="flow-item flex flex-col items-center relative flex-1 min-w-[140px]">
        <div class="flow-connector absolute top-7 left-1/2 right-[-50%] h-1 z-1">
          <div
            class="connector-line w-full h-full bg-border rounded transition-colors duration-300"
            :class="{ 'bg-gradient-to-r from-blue to-green': baseProgress === '100%' }"
          ></div>
        </div>
        <div class="flow-node flex flex-col items-center text-center relative z-2">
          <div class="node-avatar you-avatar w-15 h-15 rounded-full flex items-center justify-center mb-4 border-3 border-blue bg-gradient-to-br from-blue to-cyan">
            <UiSvgImage svg="you" class="avatar-icon w-6 h-6 text-white" />
          </div>
          <div class="node-content">
            <p class="node-title text-sm font-semibold text-color mb-1">
              {{ t('you') }}
            </p>
            <p class="node-subtitle text-xs text-gray mb-2">
              {{ t('referrer') || 'Referrer' }}
            </p>
          </div>
        </div>
      </div>

      <!-- Referral Levels -->
      <div
        v-for="(level, index) in levels"
        :key="index"
        class="flow-item level-item flex flex-col items-center relative flex-1 min-w-[140px]"
      >
        <div class="flow-connector absolute top-7 left-1/2 right-[-50%] h-1 z-1">
          <div
            class="connector-line w-full h-full bg-border rounded transition-colors duration-300"
            :class="{ 'bg-gradient-to-r from-blue to-green': level.count > 0 }"
          ></div>
        </div>
        <div class="flow-node flex flex-col items-center text-center relative z-2">
          <div
            class="node-avatar level-avatar w-15 border-4 h-15 rounded-full flex items-center justify-center mb-4 border-3 bg-secondary"
            :class="`border-${getLevelColor(index + 1)}`"
          >
            <span class="level-number text-lg font-bold text-gray">
              {{ index + 1 }}
            </span>
          </div>
          <div class="node-content">
            <div class="level-info mb-3">
              <p class="node-title text-sm font-semibold text-color mb-1">
                {{ t('level') }} {{ index + 1 }}
              </p>
              <div class="level-stats flex flex-col gap-1">
                <span class="commission-rate text-lg font-bold text-green">
                  {{ (level.percent * 100).toFixed(0) }}%
                </span>
                <span class="commission-label text-xs text-gray uppercase tracking-wider">
                  {{ t('commission') || 'Commission' }}
                </span>
              </div>
            </div>
            <div
              class="members-badge bg-secondary border border-border rounded-full px-2 py-1 transition-all duration-300"
              :class="{ 'bg-green border-green': level.count > 0 }"
            >
              <span
                class="members-count text-sm font-bold"
                :class="level.count > 0 ? 'text-white' : 'text-color'"
              >
                {{ level.count }}
              </span>
              <span
                class="members-text text-xs ml-1"
                :class="level.count > 0 ? 'text-white' : 'text-gray'"
              >
                {{ t('members') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
interface Level {
  percent: number
  count: number
}

interface UserData {
  referralPercent: number
}

interface LevelsResponse {
  counts: number[]
  percents: number[]
}

interface ReferralsResponse {
  data: UserData
}

// Composable
const { $api } = useNuxtApp()
const { t } = useI18n()
// Reactive data
const user = ref<UserData | null>(null)
const levels = ref<Level[]>([])

// Data fetching
const { data: referralsData, pending } = await useLazyAsyncData(
  'referral-how-it-works',
  async () => {
    try {
      const [refRes, lvlRes] = await Promise.all([
        $api.user.referrals() as Promise<UserData>,
        $api.user.levels() as Promise<LevelsResponse>,
      ])

      console.log(refRes)
      return {
        user: refRes,
        levels: lvlRes
      }
    } catch (error) {
      console.error('Error fetching referral data:', error)
      return null
    }
  }
)

// Update reactive data when fetch completes
watch(referralsData, (newData) => {
  if (newData) {
    user.value = newData.user
    const counts = newData.levels?.counts || []
    const percents = newData.levels?.percents || []
    levels.value = percents.map((p, i) => ({
      percent: p,
      count: counts?.[i] || 0
    }))
  }
})

// Computed
const baseProgress = computed((): string => {
  return total.value > 0 ? '100%' : '0%'
})

const total = computed((): number => {
  return levels.value.reduce((sum, level) => sum + (level.count || 0), 0)
})

const percent = computed((): number => {
  return user.value ? user.value.referralPercent * 100 : 10
})

// Methods
const getLevelColor = (level: number): string => {
  const colors = [
    'red-400',    // level 1
    'teal-400',   // level 2
    'cyan-500',   // level 3
    'green-400',  // level 4
    'yellow-400', // level 5
    'pink-400',   // level 6
    'blue-400',   // level 7
  ]
  return colors[level - 1] || 'gray-400'
}
</script>

<style scoped>
/* Mobile responsive design */
@media screen and (max-width: 768px) {
  .HowItWorks {
    .howitworks-header {
      @apply flex-col text-center gap-4 mb-6;
    }

    .section-title {
      @apply text-xl;
    }

    .total-members-card {
      @apply px-2 py-2 self-center min-w-[120px];
    }

    .members-label {
      @apply text-xs;
    }

    .members-count {
      @apply text-xl;
    }

    .referral-flow {
      @apply flex-col gap-3 mb-6 py-1;
    }

    .flow-item {
      @apply flex-row items-center min-w-full p-1 bg-secondary rounded-lg border border-border;

      .flow-connector {
        @apply hidden;
      }

      .flow-node {
        @apply flex-row text-left w-full gap-3;

        .node-avatar {
          @apply w-11 h-11 mb-0 flex-shrink-0;
        }

        .node-content {
          @apply flex justify-between items-center flex-wrap gap-2 flex-1;

          .level-info {
            @apply mb-0 flex-1 min-w-[120px];

            .node-title {
              @apply text-sm mb-1;
            }

            .level-stats {
              @apply flex-row gap-2 items-center;

              .commission-rate {
                @apply text-base;
              }

              .commission-label {
                @apply text-xs;
              }
            }
          }

          .members-badge {
            @apply flex-shrink-0 px-2 py-1 rounded-2xl;

            .members-count {
              @apply text-sm;
            }

            .members-text {
              @apply text-xs;
            }
          }
        }
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .HowItWorks {
    .howitworks-header {
      .section-title {
        @apply text-lg;
      }

      .total-members-card {
        @apply px-2 py-1;

        .members-count {
          @apply text-lg;
        }
      }
    }

    .referral-flow {
      .flow-item {
        @apply p-1;

        .flow-node {
          @apply gap-3;

          .node-avatar {
            @apply w-10 h-10;
          }

          .node-content {
            .level-info {
              .node-title {
                @apply text-sm;
              }

              .level-stats {
                .commission-rate {
                  @apply text-sm;
                }
              }
            }

            .members-badge {
              @apply px-1 py-1;

              .members-count {
                @apply text-xs;
              }
            }
          }
        }
      }
    }
  }
}

/* Small mobile adjustments */
@media screen and (max-width: 360px) {
  .HowItWorks {
    .referral-flow {
      .flow-item {
        .flow-node {
          @apply gap-2;

          .node-content {
            @apply flex-col items-start gap-2;

            .members-badge {
              @apply self-start;
            }
          }
        }
      }
    }
  }
}

/* Expanded sidebar responsive design */
@media screen and (max-width: 991px) {
  .sidebar_expanded .HowItWorks {
    .referral-flow {
      @apply flex-col;
    }

    .flow-item {
      @apply min-w-full;
    }
  }
}
</style>
