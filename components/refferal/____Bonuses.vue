<template>
  <AppCard class="Bonuses">
    <!-- Header Section -->
    <div class="bonuses-header text-center mb-8">
      <h2 class="section-title text-2xl font-bold text-color mb-2">
        {{ t('referral_bonuses') || 'Referral Bonuses' }}
      </h2>
      <p class="section-subtitle text-base text-gray opacity-80">
        {{ t('bonus_subtitle') || 'Unlock exclusive rewards as your referral network grows' }}
      </p>
    </div>

    <!-- Progress Section -->
    <div class="bonus-progress-section mb-10">
      <div class="current-progress bg-secondary p-3 rounded-xl border border-border">
        <div class="progress-info flex justify-between items-center mb-4">
          <span class="progress-label text-sm text-gray uppercase tracking-wider">
            {{ t('current_progress') || 'Current Progress' }}
          </span>
          <span class="progress-amount text-xl font-bold text-blue">
            ${{ progress.toLocaleString() }}
          </span>
        </div>
        <div class="progress-bar-container flex items-center gap-4">
          <div class="progress-bar flex-1 h-2 bg-border rounded overflow-hidden">
            <div
              class="progress-fill h-full bg-gradient-to-r from-blue to-green rounded transition-all duration-300"
              :style="{ width: overallProgressPercentage + '%' }"
            ></div>
          </div>
          <span class="progress-percentage text-sm font-semibold text-color min-w-[40px]">
            {{ overallProgressPercentage }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Bonus Tiers -->
    <div class="bonus-tiers flex flex-col gap-6 mb-8">
      <div
        v-for="(tier, index) in bonusTiers"
        :key="index"
        class="bonus-tier flex items-start gap-4 p-3 bg-secondary rounded-xl border border-border transition-all duration-300"
        :class="{
          'active bg-gradient-to-br from-green/10 to-green/5 border-green': progress >= tier.threshold,
          'next bg-gradient-to-br from-blue/10 to-blue/5 border-blue scale-[1.02]': !tier.achieved && tier.isNext
        }"
      >
        <!-- Tier Indicator -->
        <div class="tier-indicator flex flex-col items-center">
          <div
            class="tier-icon w-12 h-12 rounded-full flex items-center justify-center border-3 transition-all duration-300"
            :class="[
              progress >= tier.threshold
                ? 'bg-green border-green'
                : 'bg-bg border-border',
              tier.status
            ]"
          >
            <UiSvgImage
              v-if="progress >= tier.threshold"
              svg="check"
              class="check-icon w-5 h-5 text-white"
            />
            <span v-else class="tier-number text-sm font-bold text-gray">
              {{ index + 1 }}
            </span>
          </div>
          <div
            v-if="index < bonusTiers.length - 1"
            class="connector-line w-1 h-8 mt-2 transition-colors duration-300"
            :class="progress >= bonusTiers[index + 1].threshold ? 'bg-green' : 'bg-border'"
          ></div>
        </div>

        <!-- Tier Content -->
        <div class="tier-content flex-1">
          <div class="tier-header flex justify-between items-start mb-4 flex-wrap gap-4">
            <h3 class="tier-title text-xl font-bold text-color">
              {{ tier.title }}
            </h3>
            <div class="tier-reward text-right">
              <span class="reward-amount block text-lg font-bold text-green">
                ${{ tier.reward.toLocaleString() }}
              </span>
              <span class="reward-label block text-xs text-gray uppercase tracking-wider">
                {{ t('bonus') || 'Bonus' }}
              </span>
            </div>
          </div>

          <div class="tier-details">
            <p class="tier-requirement text-sm text-gray mb-3">
              {{ t('requirement') || 'Requirement' }}: ${{ tier.threshold.toLocaleString() }}
              {{ t('in_referrals') || 'in referrals' }}
            </p>
            <div class="tier-progress" v-if="progress < tier.threshold">
              <div class="progress-mini flex items-center gap-4">
                <div class="progress-mini-bar flex-1 h-1 bg-border rounded overflow-hidden">
                  <div
                    class="progress-mini-fill h-full bg-blue rounded transition-all duration-300"
                    :style="{ width: Math.min(100, (progress / tier.threshold) * 100) + '%' }"
                  ></div>
                </div>
                <span class="remaining-amount text-xs text-gray whitespace-nowrap">
                  ${{
                    Math.max(0, tier.threshold - progress).toLocaleString()
                  }} {{ t('remaining') || 'remaining' }}
                </span>
              </div>
            </div>
          </div>

          <div
            v-if="progress >= tier.threshold"
            class="tier-achieved flex items-center gap-2 text-green font-semibold mt-3"
          >
            <UiSvgImage svg="check" class="achieved-icon w-4 h-4"/>
            <span>{{ t('achieved') || 'Achieved!' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bonus Info -->
    <div class="bonus-info">
      <div class="info-card flex gap-4 p-3 bg-secondary rounded-xl border border-border">
        <UiSvgImage svg="info" class="info-icon w-6 h-6 text-cyan flex-shrink-0 mt-1"/>
        <div class="info-content">
          <h4 class="text-base font-semibold text-color mb-2">
            {{ t('how_bonuses_work') || 'How Bonuses Work' }}
          </h4>
          <p class="text-sm text-gray leading-relaxed">
            {{
              t('bonus_explanation') || 'Bonuses are awarded automatically when you reach each tier threshold. The more people you refer, the higher your bonus rewards!'
            }}
          </p>
        </div>
      </div>
    </div>
  </AppCard>
</template>

<script setup lang="ts">
interface BonusTier {
  title: string
  threshold: number
  reward: number
  status: 'achieved' | 'pending'
  isNext?: boolean
  achieved?: boolean
}

interface ProgressResponse {
  progress: number
}

// Composable
const {$api} = useNuxtApp()
const {t} = useI18n()
// Reactive data
const progress = ref<number>(0)

// Data fetching
const {data: progressData, pending} = await useAsyncData(
  'user-progress',
  async () => {
    try {
      const data = await $api.user.progress() as ProgressResponse
      return data
    } catch (error) {
      console.error('Failed to fetch progress data:', error)
      return {progress: 0}
    }
  }
)

// Update reactive data when fetch completes
watch(progressData, (newData) => {
  if (newData) {
    progress.value = newData.progress || 0
  }
}, {immediate: true})

// Computed
const bonusTiers = computed((): BonusTier[] => {
  const tiers: BonusTier[] = [
    {
      title: t('bronze_tier') || 'Bronze Tier',
      threshold: 100000,
      reward: 5000,
      status: progress.value >= 100000 ? 'achieved' : 'pending',
      achieved: progress.value >= 100000
    },
    {
      title: t('silver_tier') || 'Silver Tier',
      threshold: 250000,
      reward: 15000,
      status: progress.value >= 250000 ? 'achieved' : 'pending',
      achieved: progress.value >= 250000
    },
    {
      title: t('gold_tier') || 'Gold Tier',
      threshold: 500000,
      reward: 35000,
      status: progress.value >= 500000 ? 'achieved' : 'pending',
      achieved: progress.value >= 500000
    },
    {
      title: t('platinum_tier') || 'Platinum Tier',
      threshold: 1000000,
      reward: 75000,
      status: progress.value >= 1000000 ? 'achieved' : 'pending',
      achieved: progress.value >= 1000000
    },
    {
      title: t('diamond_tier') || 'Diamond Tier',
      threshold: 2000000,
      reward: 150000,
      status: progress.value >= 2000000 ? 'achieved' : 'pending',
      achieved: progress.value >= 2000000
    }
  ]

  // Mark the next tier to be achieved
  const nextTier = tiers.find(tier => progress.value < tier.threshold)
  if (nextTier) {
    nextTier.isNext = true
  }

  return tiers
})

const overallProgressPercentage = computed((): number => {
  const maxTier = Math.max(...bonusTiers.value.map(tier => tier.threshold))
  return Math.min(100, Math.round((progress.value / maxTier) * 100))
})

// Legacy computed properties for backward compatibility
const progress1 = computed((): string => {
  if (progress.value >= 100000 && progress.value < 250000) {
    return (progress.value / 250000) * 100 + '%'
  } else if (progress.value >= 250000) {
    return '100%'
  } else {
    return '0%'
  }
})

const progress2 = computed((): string => {
  if (progress.value >= 250000 && progress.value < 1000000) {
    return (progress.value / 1000000) * 100 + '%'
  } else if (progress.value >= 1000000) {
    return '100%'
  } else {
    return '0%'
  }
})
</script>

<style scoped>
/* Mobile responsive design */
@media screen and (max-width: 768px) {
  .Bonuses {
    .bonuses-header {
      @apply mb-6;
    }

    .section-title {
      @apply text-xl;
    }

    .section-subtitle {
      @apply text-sm;
    }

    .bonus-progress-section {
      @apply mb-8;

      .current-progress {
        @apply p-2 rounded-lg;

        .progress-info {
          @apply flex-col text-center gap-2 mb-3;

          .progress-label {
            @apply text-xs;
          }

          .progress-amount {
            @apply text-lg;
          }
        }

        .progress-bar-container {
          @apply flex-col gap-2;

          .progress-bar {
            @apply h-1;
          }

          .progress-percentage {
            @apply text-xs self-center;
          }
        }
      }
    }

    .bonus-tiers {
      @apply gap-4 mb-6;

      .bonus-tier {
        @apply p-2 rounded-lg flex-col gap-3;

        &.next {
          @apply scale-100;
        }

        .tier-indicator {
          @apply flex-row self-start mb-2;

          .tier-icon {
            @apply w-9 h-9;

            .check-icon {
              @apply w-3 h-3;
            }

            .tier-number {
              @apply text-xs;
            }
          }

          .connector-line {
            @apply hidden;
          }
        }

        .tier-content {
          .tier-header {
            @apply flex-col items-start gap-2 mb-3;

            .tier-title {
              @apply text-lg;
            }

            .tier-reward {
              @apply text-left;

              .reward-amount {
                @apply text-base;
              }

              .reward-label {
                @apply text-xs;
              }
            }
          }

          .tier-details {
            .tier-requirement {
              @apply text-xs mb-2;
            }

            .tier-progress {
              .progress-mini {
                @apply flex-col gap-2;

                .progress-mini-bar {
                  @apply h-1;
                }

                .remaining-amount {
                  @apply text-xs text-center;
                }
              }
            }
          }

          .tier-achieved {
            @apply text-sm mt-2;

            .achieved-icon {
              @apply w-3 h-3;
            }
          }
        }
      }
    }

    .bonus-info {
      .info-card {
        @apply p-2 rounded-lg flex-col gap-3;

        .info-icon {
          @apply w-5 h-5 mt-0;
        }

        .info-content {
          h4 {
            @apply text-sm mb-1;
          }

          p {
            @apply text-xs leading-relaxed;
          }
        }
      }
    }
  }
}

@media screen and (max-width: 480px) {
  .Bonuses {
    .bonuses-header {
      .section-title {
        @apply text-lg;
      }

      .section-subtitle {
        @apply text-xs;
      }
    }

    .bonus-progress-section {
      .current-progress {
        @apply p-1;

        .progress-info {
          .progress-amount {
            @apply text-base;
          }
        }
      }
    }

    .bonus-tiers {
      @apply gap-3;

      .bonus-tier {
        @apply p-1;

        .tier-indicator {
          .tier-icon {
            @apply w-8 h-8;

            .tier-number {
              @apply text-xs;
            }
          }
        }

        .tier-content {
          .tier-header {
            .tier-title {
              @apply text-base;
            }

            .tier-reward {
              .reward-amount {
                @apply text-sm;
              }
            }
          }
        }
      }
    }
  }
}

/* Expanded sidebar responsive design */
@media screen and (max-width: 991px) {
  .sidebar_expanded .Bonuses {
    .bonus-tiers {
      .bonus-tier {
        @apply flex-col;
      }
    }
  }
}
</style>
