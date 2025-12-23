<template>
  <div
    class="LeftSidebar"
    :class="[
      expandSidebar ? 'w-sidebar-opened' : 'w-sidebar-closed',
      { expanded: expandSidebar },
      isMobile ? 'mobile-layout' : 'desktop-layout'
    ]"
  >
    <div class="flex flex-col justify-between h-full">
      <!-- Top Section -->
      <div class="top-section">
        <div class="logo-block flex items-center h-[57px]">
          <UiButton
            class="shrink-0 menu-btn h-8 flex flex-col items-center justify-center"
            theme="transparent"
            @click="handleSidebar"
          >
            <UiSvgImage :svg="expandSidebar ? arrowIcon : menuIcon" />
          </UiButton>
          <transition name="fade">
            <NuxtLink
              v-if="expandSidebar"
              to="/cabinet/dashboard"
              class="logo ml-3 text-color font-semibold text-xl whitespace-nowrap"
            >
              {{ wlTitle }}
            </NuxtLink>
          </transition>
        </div>

        <!-- Navigation -->
        <div class="middle-section mt-10 mb-10">
          <!-- Profile (Mobile only) -->
          <div v-if="isMobile" class="profile pb-2 border-b border-border mb-2">
            <div class="user flex items-center">
              <img class="avatar w-9 h-9 min-w-9 mr-2" src="~/assets/img/avatar.png" alt="avatar" />
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
            <!-- Main Navigation Item -->
            <div
              class="nav-item-container"
              :class="{ 'router-link-active': isItemActive(item) }"
            >
              <!-- For items with submenu -->
              <div
                v-if="item.submenu"
                class="nav-item px-1 py-1 flex items-center transition-all duration-300 w-full cursor-pointer"
                :class="{
                  'active-nav-item': isItemActive(item),
                  'expanded-nav-item': item.expanded
                }"
                @click="expandSubMenu(item)"
              >
                <div
                  class="nav-item-icon rounded-full w-8 h-8 p-2 flex justify-center items-center transition-all duration-300"
                  :class="{
                    'bg-[#ffe6b3]': isItemActive(item) || item.expanded,
                    'bg-secondary': !item.expanded && !isItemActive(item)
                  }"
                >
                  <UiSvgImage
                    :svg="item.svg"
                    :class="{
                      '[&>path]:fill-[#dd7c37]': isItemActive(item) || item.expanded,
                      '[&>path]:fill-gray-400': !isItemActive(item) && !item.expanded
                    }"
                  />
                </div>
                <div
                  class="nav-item-title ml-2 font-medium text-base transition-all duration-300"
                  :class="{
                    'opacity-100': expandSidebar,
                    'opacity-0': !expandSidebar,
                    'text-color': isItemActive(item) || item.expanded,
                    'text-gray': !isItemActive(item) && !item.expanded
                  }"
                >
                  {{ item.text }}
                </div>
                <div
                  v-if="item.submenu"
                  class="arrow-icon text-xs transition-transform duration-300 ml-auto"
                  :class="{
                    'rotate-90': item.expanded,
                    '-rotate-90': !item.expanded,
                    'text-color': isItemActive(item),
                    'text-gray': !isItemActive(item)
                  }"
                >
                  <span>&#10094;</span>
                </div>
              </div>

              <!-- For simple link items -->
              <NuxtLink
                v-else-if="!item.WIP"
                :to="item.to"
                class="nav-item px-1 py-1 flex items-center transition-all duration-300 w-full cursor-pointer"
                active-class="active-nav-item"
                exact-active-class="exact-active-nav-item"
                @click="handleNavClick(item)"
              >
                <div
                  class="nav-item-icon rounded-full w-8 h-8 p-2 flex justify-center items-center transition-all duration-300"
                  :class="{
                    'bg-[#ffe6b3]': isItemActive(item),
                    'bg-secondary': !isItemActive(item)
                  }"
                >
                  <UiSvgImage
                    :svg="item.svg"
                    :class="{
                      '[&>path]:fill-[#dd7c37]': isItemActive(item),
                      '[&>path]:fill-gray-400': !isItemActive(item)
                    }"
                  />
                </div>
                <div
                  class="nav-item-title ml-2 font-medium text-base transition-all duration-300"
                  :class="{
                    'opacity-100': expandSidebar,
                    'opacity-0': !expandSidebar,
                    'text-color': isItemActive(item),
                    'text-gray': !isItemActive(item)
                  }"
                >
                  {{ item.text }}
                </div>
              </NuxtLink>

              <div v-else class="nav-item px-1 py-1 flex items-center transition-all duration-300 w-full cursor-pointer">
                <div
                  class="nav-item-icon rounded-full w-8 h-8 p-2 flex justify-center items-center transition-all duration-300"
                  :class="{
                    'bg-[#ffe6b3]': isItemActive(item),
                    'bg-secondary': !isItemActive(item)
                  }"
                >
                  <UiSvgImage
                    :svg="item.svg"
                    :class="{
                      '[&>path]:fill-[#dd7c37]': isItemActive(item),
                      '[&>path]:fill-gray-400': !isItemActive(item)
                    }"
                  />
                </div>
                <div
                  class="nav-item-title ml-2 font-medium text-base transition-all duration-300"
                  :class="{
                    'opacity-100': expandSidebar,
                    'opacity-0': !expandSidebar,
                    'text-color': isItemActive(item),
                    'text-gray': !isItemActive(item)
                  }"
                >
                  {{ item.text }}
                </div>
              </div>

              <!-- Submenu -->
              <UiTransitionExpand>
                <div
                  v-if="item.submenu && (item.expanded || isItemActive(item)) && expandSidebar"
                  class="submenu ml-10 pl-2 overflow-hidden transition-all duration-300"
                >
                  <NuxtLink
                    v-for="(menuItem, index) in item.submenu"
                    :key="index"
                    :to="menuItem.to"
                    class="submenu-item block font-medium text-base py-1 cursor-pointer whitespace-nowrap transition-colors duration-300"
                    :class="{
                      'border-b border-border': index !== item.submenu.length - 1,
                      'active-submenu-item': isSubItemActive(menuItem),
                      'text-gray hover:text-color': true
                    }"
                    active-class="active-submenu-item"
                    exact-active-class="exact-active-submenu-item"
                  >
                    {{ menuItem.text }}
                  </NuxtLink>
                </div>
              </UiTransitionExpand>
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Section -->
      <transition name="fade">
        <div v-if="expandSidebar" class="bottom-section pb-7">
          <!-- Theme Toggle -->
          <div
            class="switch-toggle relative bg-secondary rounded-[25px] flex relative text-md min-h-[50px] mx-auto my-0 transition-all duration-300"
            :class="[
              isMobile ? 'w-full justify-around' : 'w-85 justify-between',
              { 'isLight': colorMode.preference === 'light' }
            ]"
          >
            <div
              class="background absolute top-1 h-[42px] bg-bg pointer-events-none rounded-[25px] transition-all duration-300 z-0"
              :class="[
                colorMode.preference === 'light' ? 'left-1 w-[calc(50%-8px)] bg-[#FCFCFC] shadow-sm' : 'left-[calc(100%-50%+4px)] w-[calc(50%-8px)] bg-charade'
              ]"
            />

            <UiButton
              class="light flex items-center py-2 px-3 z-10 capitalize transition-colors duration-300 !rounded-[25px] !bg-transparent"
              :class="[
                colorMode.preference === 'light' ? 'text-color' : 'text-gray',
                isMobile ? 'w-1/2' : 'w-[calc(50%-8px)]'
              ]"
              theme="transparent"
              @click="setColorMode('light')"
            >
              <UiSvgImage svg="light" />
              <span class="ml-3 text-xs">{{ t('LeftSidebar.light') }}</span>
            </UiButton>

            <UiButton
              class="dark flex items-center py-2 px-3 z-10 capitalize transition-colors duration-300 !rounded-[25px] !bg-transparent"
              :class="[
                colorMode.preference === 'dark' ? 'text-color' : 'text-gray',
                isMobile ? 'w-1/2' : 'w-[calc(50%-8px)]'
              ]"
              theme="transparent"
              @click="setColorMode('dark')"
            >
              <UiSvgImage svg="dark" />
              <span class="ml-3 text-xs">{{ t('LeftSidebar.dark') }}</span>
            </UiButton>
          </div>

          <!-- Copyright -->
          <div class="copyright border-t border-border pt-4 text-xs text-gray font-semibold whitespace-nowrap">
            <p class="copyright-text mb-3">
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
interface Utils {
  [key: string]: any;
}

interface NavigationItem {
  text: string;
  svg: string;
  to?: string;
  WIP?: boolean;
  expanded?: boolean;
  submenu?: SubMenuItem[];
}

interface SubMenuItem {
  text: string;
  to: string;
}

// Props
interface Props {
  expandSidebar: boolean;
}

const props = defineProps<Props>();

// Emits
const emit = defineEmits<{
  'handle-sidebar': [value: boolean];
}>();

// Composables
const colorMode = useColorMode();
const { $modal } = useNuxtApp();
const route = useRoute();
const router = useRouter();
const userStore = useAuthStore();
const { t } = useI18n();
const $utils = useNuxtApp().$utils as Utils;

// Reactive data
const navigation = ref<NavigationItem[]>([
  {
    text: t('LeftSidebar.dashboard'),
    svg: 'bag',
    to: '/cabinet/dashboard',
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
    to: '/cabinet/settings',
  },
]);

// Computed
const menuIcon = computed(() =>
  colorMode.value === 'light' ? 'menu-dark' : 'menu'
);

const arrowIcon = computed(() =>
  colorMode.value === 'light' ? 'arrow-left-dark' : 'arrow-left'
);

const wlTitle = computed(() => {
  return $utils?.hostToTitle?.(window?.location?.host) || 'Capella Finance';
});

const isMobile = computed(() => {
  if (process.client) {
    return window.innerWidth <= 600;
  }
  return false;
});

const userName = computed(() => {
  const user = userStore.user || {};
  return user.name || user.email;
});

// Methods
const isItemActive = (item: NavigationItem): boolean => {
  if (item.submenu) {
    // For items with submenu, check if any subitem is active
    return item.submenu.some(subItem => isSubItemActive(subItem));
  }

  // For simple items, check if current route matches
  if (!item.to) return false;

  // Check exact match for dashboard and settings
  if (item.to === '/cabinet/dashboard' || item.to === '/cabinet/settings') {
    return route.path === item.to;
  }

  // For other items, check if route starts with the item's to
  return route.path.startsWith(item.to);
};

const isSubItemActive = (subItem: SubMenuItem): boolean => {
  if (!subItem.to) return false;

  // Check exact match for submenu items
  return route.path === subItem.to ||
    route.path.startsWith(subItem.to + '/');
};

const expandSubMenu = (item: NavigationItem) => {
  if (!item.submenu) return;

  // Toggle expansion
  item.expanded = !item.expanded;
  if (!props.expandSidebar) emit('handle-sidebar', true);
  console.log(item, props.expandSidebar, isMobile.value, item.expanded)
  // If expanding and on mobile, close sidebar
  // if (props.expandSidebar && isMobile.value && item.expanded) {
  //   emit('handle-sidebar', false);
  // }
};

const handleNavClick = (item: NavigationItem) => {

  if (item.WIP) {
    // Show WIP message or prevent navigation
    return;
  }

  // Navigate to the item
  if (item.to) {
    router.push(item.to);
  }

  // Close sidebar on mobile
  if (isMobile.value) {
    emit('handle-sidebar', false);
  }
};

const handleSidebar = () => {
  emit('handle-sidebar', !props.expandSidebar);
};

const setColorMode = (mode: 'light' | 'dark') => {
  colorMode.preference = mode;
};

// Initialize expanded state based on current route
onMounted(() => {
  navigation.value.forEach(item => {
    if (item.submenu) {
      item.expanded = item.submenu.some(subItem => isSubItemActive(subItem));
    }
  });
});

// Watch for route changes
watch(
  () => route.path,
  () => {
    if (isMobile.value) {
      emit('handle-sidebar', false);
    }

    // Update expanded state based on new route
    navigation.value.forEach(item => {
      if (item.submenu) {
        item.expanded = item.submenu.some(subItem => isSubItemActive(subItem));
      }
    });
  }
);
</script>

<style scoped >
.LeftSidebar {
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  position: fixed;
  left: 0;
  border-right: 1px solid var(--border-color);
  padding-top: 10px;
  padding-left: 60px;
  padding-right: 12px;
  transition: width 0.3s;
  background-color: var(--bg);

  /* Hide scrollbar */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    width: 0;
    display: none;
  }
}

@media screen and (max-width: 600px){
  .LeftSidebar {
    display: none;
  }
  .expanded {
    position: fixed;
    width: 100%;
    display: block;
  }
}

.w-sidebar-opened {
  width: 320px;
}

.w-sidebar-closed {
  width: 125px;
}

/* Navigation item styles */
.nav-item {
  position: relative;
  padding: 10px;
  display: flex;
  align-items: center;
  transition: all 0.3s;
  width: 100%;
  cursor: pointer;
  border-radius: 8px;
  margin-bottom: 4px;

  &:hover {
    background-color: var(--bg-secondary);

    .nav-item-icon:not(.bg-[#ffe6b3]) {
      background-color: var(--bg-tertiary);
    }

    .nav-item-title:not(.text-color) {
      color: var(--text-color);
    }

    .arrow-icon:not(.text-color) {
      color: var(--text-color);
    }
  }
}

/* Active state for navigation items */
.active-nav-item {
  .nav-item-title {
    color: var(--text-color) !important;
    font-weight: 500;
  }

  .nav-item-icon {
    background-color: #ffe6b3 !important;
  }

  .arrow-icon {
    color: var(--text-color) !important;
  }
}

.exact-active-nav-item {
  /* Additional styles for exact active items if needed */
}

/* Submenu item styles */
.submenu-item {
  position: relative;
  padding: 8px 12px;
  border-radius: 6px;
  margin: 2px 0;
  transition: all 0.2s;

  &:hover {
    background-color: var(--bg-secondary);
    color: var(--text-color) !important;
    transform: translateX(4px);
  }
}

.active-submenu-item {
  color: var(--text-color) !important;
  font-weight: 500;
  background-color: var(--bg-secondary);

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 60%;
    background-color: #dd7c37;
    border-radius: 0 2px 2px 0;
  }
}

.exact-active-submenu-item {
  /* Additional styles for exact active submenu items */
}


/* Mobile styles */
.mobile-layout {
  min-height: 100%;
  width: 0px;
  padding: 0 0 0 0;
  border: 0;
  background-color: var(--bg);

  &.expanded {
    width: 100%;
    position: fixed;
    z-index: 9999;
  }

  .active-nav-item {
    pointer-events: none;
  }

  .submenu-item {
    display:flex;
  }

  .logo-block {
    border-bottom: 1px solid var(--border-color);
    padding: 0 20px 0 20px;

    .logo {
      font-size: 20px;
    }
  }

  .middle-section {
    margin-top: 10px;
    padding: 0 20px;

    .profile {
      display: block;
    }
  }

  .bottom-section {
    padding: 0 20px 30px 20px;
  }

  .menu-btn {
    padding: 0;
  }

  /* .submenu {
    display:flex;
    flex-flow:column;
    align-items: flex-start;
    padding-left:51px;
    margin-left:0;
  }
  .submenu-item {
    width:100%;
    display:flex;
    align-items: center;
    justify-content: flex-start;
  } */
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

.switch-toggle {
  position: relative;
  background: var(--bg-secondary);
  border-radius: 25px;
  display: flex;
  position: relative;
  padding: 4px;
  width: 250px;
  margin: 30px auto 19px auto;
  min-height: 50px;
}

.nav-item-icon {
  @apply shrink-0;
  transition: all 0.3s;
}

/* WIP item styling */
.WIP {
  cursor: not-allowed;
  position: relative;
  transition: filter 0.4s ease;
  z-index: 10;

  .nav-item:hover {
    background-color: transparent !important;
  }
  &::after {
    position: relative;
    z-index: 99;
    width: 64px;
    transition: opacity 0.4s ease;
    opacity: 0;
    pointer-events: none;
    content: 'Work in progress!';
    color: black;
    background: white;
    padding: 5px 10px;
    position: absolute;
    right: -5px;
    bottom: -35px;
    font-weight: 400;
    font-size: 10px;
  }
  &:hover::after {
    opacity: 1;
  }
  &:hover {
    filter: grayscale(1);
    cursor: not-allowed;
  }
  & > * {
    opacity: 0.4;
    pointer-events: none;
  }
}
</style>

<style>
.cabinet_mobile.sidebar_expanded {
  height:100dvh;
  overflow:hidden;
}

</style>
