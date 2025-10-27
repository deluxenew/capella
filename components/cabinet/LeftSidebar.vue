<template>
  <div
    class="LeftSidebar"
    :class="[
      expandSidebar ? 'w-sidebar-opened' : 'w-sidebar-closed',
      { 'expanded': expandSidebar },
      isMobile ? 'mobile-layout' : 'desktop-layout'
    ]"
  >
    <div class="flex flex-col justify-between h-full">
      <!-- Top Section -->
      <div class="top-section">
        <div class="logo-block flex items-center min-h-[38px]">
          <UiButton
            class="menu-btn min-w-6 min-h-6 ml-3.5"
            theme="transparent"
            @click="handleSidebar"
          >
            <UiSvgImage :svg="expandSidebar ? arrowIcon : menuIcon" />
          </UiButton>
          <transition name="fade">
            <NuxtLink
              v-if="expandSidebar"
              to="/cabinet/dashboard"
              class="logo ml-3 text-color font-semibold text-xl"
            >
              {{ wlTitle }}
            </NuxtLink>
          </transition>
        </div>

        <!-- Navigation -->
        <div class="middle-section mt-20 mb-20">
          <!-- Profile (Mobile only) -->
          <div class="profile hidden mobile:block pb-2.5 border-b border-border mb-2.5">
            <div class="user flex items-center">
              <img class="avatar w-9 h-9 min-w-9 mr-2.5" src="~/assets/img/avatar.png" alt="avatar" />
              <h2 class="user-text whitespace-nowrap text-sm">
                {{ t('AuthHeader.greeting') }}, {{ userName }}
              </h2>
            </div>
          </div>

          <!-- Navigation Items -->
          <div
            v-for="(item, idx) in navigation"
            :key="idx"
            class="nav-item-wrapper"
            :class="{
              'has-submenu': item.submenu,
              [`z-${navigation.length - idx}`]: true,
              'WIP': item.WIP
            }"
          >
            <Variable
              v-slot="{ itemInSubPage = '' } = {}"
              :item-in-sub-page="inSubPage(item)"
            >
              <div>
                <component
                  :is="item.submenu ? 'div' : 'NuxtLink'"
                  class="nav-item px-2.5 py-2.5 flex items-center transition-all duration-300 w-full cursor-pointer"
                  :class="{
                    'nuxt-link-active': itemInSubPage,
                    'bg-secondary rounded-lg': itemInSubPage || item.expanded,
                    'pointer-events-none opacity-50': item.WIP
                  }"
                  :to="item.to"
                  @click="expandSubMenu(item, itemInSubPage)"
                >
                  <div
                    class="nav-item-icon rounded-full bg-secondary w-7 h-7 p-1.5 flex justify-center items-center transition-all duration-300"
                    :class="{
                      'bg-[#ffe6b3]': itemInSubPage || item.expanded
                    }"
                  >
                    <UiSvgImage
                      :svg="item.svg"
                      :class="{
                        '[&>path]:fill-[#dd7c37]': itemInSubPage || item.expanded
                      }"
                    />
                  </div>
                  <div
                    class="nav-item-title ml-2.5 font-medium text-base text-gray transition-all duration-300"
                    :class="{
                      'opacity-100': expandSidebar,
                      'opacity-0': !expandSidebar,
                      'text-color': itemInSubPage || item.expanded
                    }"
                  >
                    {{ item.text }}
                  </div>
                  <div
                    v-if="item.submenu"
                    class="text-gray text-xs transition-transform duration-300"
                    :class="{
                      'rotate-90': item.expanded,
                      '-rotate-90': !item.expanded
                    }"
                  >
                    <span>&#10094;</span>
                  </div>
                </component>

                <UiTransitionExpand>
                  <div
                    v-if="item.submenu && (item.expanded || itemInSubPage) && expandSidebar"
                    class="submenu ml-10 pl-2.5 overflow-hidden transition-all duration-300"
                  >
                    <NuxtLink
                      v-for="(menuItem, index) in item.submenu"
                      :key="index"
                      class="submenu-item block font-medium text-base text-gray py-2.5 cursor-pointer whitespace-nowrap transition-colors duration-300"
                      :class="{
                        'border-b border-border': index !== item.submenu.length - 1,
                        'text-color hover:text-color': true
                      }"
                      :to="menuItem.to"
                    >
                      {{ menuItem.text }}
                    </NuxtLink>
                  </div>
                </UiTransitionExpand>
              </div>
            </Variable>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <transition name="fade">
        <div v-if="expandSidebar" class="bottom-section pb-7">
          <!-- Social Links (commented out) -->
          <!--
          <div class="nav-socials flex items-center gap-8 w-50">
            <a
              v-for="(item, idx) in sidebarSocials"
              :key="idx"
              :href="item.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              <UiSvgImage :svg="item.svg" class="max-w-6" />
            </a>
          </div>
          -->

          <!-- Theme Toggle -->
          <div
            class="switch-toggle relative bg-secondary rounded-[25px] flex relative text-md min-h-[50px] mx-auto my-0 transition-all duration-300"
            :class="[
              isMobile ? 'w-full justify-around' : 'w-85 justify-between',
              { 'isLight': colorMode === 'light' }
            ]"
          >
            <div
              class="background absolute top-1 h-[42px] bg-bg pointer-events-none rounded-[25px] transition-all duration-300 z-0"
              :class="[
                colorMode === 'light' ? 'left-1 w-[calc(50%-8px)]' : 'left-[calc(100%-50%+4px)] w-[calc(50%-8px)]'
              ]"
            />

            <UiButton
              class="light flex items-center py-3 px-6 z-10 capitalize transition-colors duration-300"
              :class="[
                colorMode === 'light' ? 'text-color' : 'text-gray',
                isMobile ? 'w-1/2' : 'w-[calc(50%-8px)]'
              ]"
              theme="transparent"
              @click="setColorMode('light')"
            >
              <UiSvgImage
                svg="light"
                :class="colorMode === 'light' ? '[&>path]:fill-color' : '[&>path]:fill-gray'"
              />
              <span class="ml-3">{{ t('LeftSidebar.light') }}</span>
            </UiButton>

            <UiButton
              class="dark flex items-center py-3 px-6 z-10 capitalize transition-colors duration-300"
              :class="[
                colorMode === 'dark' ? 'text-color' : 'text-gray',
                isMobile ? 'w-1/2' : 'w-[calc(50%-8px)]'
              ]"
              theme="transparent"
              @click="setColorMode('dark')"
            >
              <UiSvgImage
                svg="dark"
                :class="colorMode === 'dark' ? '[&>path]:fill-color' : '[&>path]:fill-gray'"
              />
              <span class="ml-3">{{ t('LeftSidebar.dark') }}</span>
            </UiButton>
          </div>

          <!-- Copyright -->
          <div class="copyright border-t border-border pt-4.5 text-xs text-gray font-semibold whitespace-nowrap">
            <p class="copyright-text mb-3.5">
              2022 {{ t('LeftSidebar.all_rights_reserved') }}
            </p>
            <UiButton
              theme="link"
              class="copyright-link underline text-xs text-gray"
              @click="$modal.open('terms')"
            >
              {{ t('LeftSidebar.terms_and_conditions') }}
            </UiButton>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
// Types
import {navigateTo} from "#imports";

interface NavigationItem {
  text: string
  svg: string
  to?: string
  WIP?: boolean
  expanded?: boolean
  submenu?: SubMenuItem[]
}

interface SubMenuItem {
  text: string
  to: string
}

interface SidebarSocial {
  svg: string
  url: string
}

// Props
interface Props {
  expandSidebar: boolean
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  'handle-sidebar': [value: boolean]
}>()

// Composable
const colorMode = useColorMode()
const { $utils, $modal } = useNuxtApp()
const route = useRoute()
const userStore = useUserStore()
const {t} = useI18n()
// Reactive data
const sidebarSocials = ref<SidebarSocial[]>([
  {
    svg: 'twitter-dark',
    url: 'https://twitter.com/capellafinance',
  },
  {
    svg: 'telegram',
    url: 'https://t.me/capellaChannel',
  },
  {
    svg: 'discord',
    url: 'https://discord.com/invite/mpMsNyBGw4',
  },
  {
    svg: 'gitbook',
    url: 'https://docs.capella.finance/',
  },
])

const navigation = ref<NavigationItem[]>([
  {
    text: t('LeftSidebar.dashboard'),
    svg: 'bag',
    to: '/cabinet/dashboard/',
  },
  {
    text: t('LeftSidebar.pools'),
    svg: 'flask',
    submenu: [
      {
        text: t('stable_pool'),
        to: '/cabinet/pools/stable',
      },
      {
        text: t('coin_pool'),
        to: '/cabinet/pools/coin',
      },
      {
        text: t('dex_pool'),
        to: '/cabinet/pools/dex',
      },
    ],
  },
  {
    text: t('LeftSidebar.dao'),
    svg: 'list-format',
    to: '/cabinet/dao',
    WIP: true,
  },
  {
    text: t('LeftSidebar.refferal'),
    svg: 'sitemap',
    to: '/cabinet/affiliates',
  },
  {
    text: t('LeftSidebar.settings'),
    svg: 'settings',
    to: '/cabinet/settings/',
  },
])

// Computed
const menuIcon = computed(() =>
  colorMode.value === 'light' ? 'menu-dark' : 'menu'
)

const arrowIcon = computed(() =>
  colorMode.value === 'light' ? 'arrow-left-dark' : 'arrow-left'
)

const wlTitle = computed(() =>
  $utils.hostToTitle?.(window.location.host)
)



const isMobile = computed(() => {
  if (process.client) {
    return window.innerWidth <= 600 || useDevice().isMobile
  }
  return false
})

const userName = computed(() => {
  const user = userStore.user || {}
  return user.name || user.email
})

// Watchers
watch(() => route.path, () => {
  if (isMobile.value) {
    emit('handle-sidebar', false)
  }

  // Close expanded items when route changes
  navigation.value.forEach(item => {
    if (item.expanded && !inSubPage(item)) {
      item.expanded = false
    }
  })
})

// Methods
const expandSubMenu = (item: NavigationItem, itemInSubPage: boolean) => {
  if (!itemInSubPage && item.submenu) {
    item.expanded = !item.expanded
  } else  navigateTo(item.to)

  if (!props.expandSidebar) {
    emit('handle-sidebar', !props.expandSidebar)
  }
}

const handleSidebar = () => {
  emit('handle-sidebar', !props.expandSidebar)
}

const inSubPage = (item: NavigationItem): boolean => {
  if (!item.submenu) return false
  return item.submenu.some(el => route.path.includes(el.to))
}

const setColorMode = (mode: 'light' | 'dark') => {
  colorMode.value = mode
}
</script>

<style scoped>
.LeftSidebar {
  height: 100vh;
  z-index: 100;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  left: 0;
  border-right: 1px solid var(--border-color);
  padding-top: 10px;
  padding-left: 60px;
  padding-right: 20px;
  transition: width 0.3s;

  /* Hide scrollbar for Webkit browsers */
  &::-webkit-scrollbar {
    width: 0;
  }
}

.w-sidebar-opened {
  width: 320px;
}

.w-sidebar-closed {
  width: 125px;
}

/* Mobile styles */
.mobile-layout {
  min-height: 100%;
  width: 0px;
  padding: 15px 0 0 0;
  border: 0;
  background-color: var(--bg);

  &.expanded {
    width: 100%;
    position: fixed;
  }

  .logo-block {
    border-bottom: 1px solid var(--border-color);
    padding-bottom: 20px;

    .logo {
      font-size: 20px;
    }
  }

  .middle-section {
    margin-top: 10px;
    padding: 0 10px;

    .profile {
      display: block;
    }
  }

  .bottom-section {
    padding: 0 10px 30px 10px;
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom CSS variables for compatibility */
.LeftSidebar {
  --bg-secondary: theme('colors.bg-secondary');
  --border-color: theme('colors.border-color');
  --color: theme('colors.color');
  --color_svg: theme('colors.color-svg');
  --bg: theme('colors.dark');
}
</style>
