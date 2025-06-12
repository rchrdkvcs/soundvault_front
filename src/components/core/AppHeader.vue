<script lang="ts" setup></script>

<template>
  <header class="grid grid-cols-3 items-center gap-4 px-4">
    <div class="justify-start w-fit">
      <RouterLink to="/">
        <img
          src="../../assets/1203953.svg"
          alt="Soundvault logo"
          height="100"
          width="100"
          class="h-12 w-fit"
        />
      </RouterLink>
    </div>

    <div class="flex justify-center w-full">
      <input
        type="text"
        placeholder="Recherchez des plugins, créateurs, et plus !"
        class="hidden md:flex input input-bordered w-full"
      />

      <!-- Bouton loupe mobile -->
      <button class="btn btn-square md:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          class="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="{2}"
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </div>

    <div class="flex gap-4 justify-end">
      <button class="btn btn-square btn-square">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-label="Icon"
          role="img"
          class="min-h-[var(--button-m-icon-size)] w-[var(--button-m-icon-size)]"
        >
          <path
            fill-rule="evenodd"
            d="M1 4.75A.75.75 0 0 1 1.75 4h1.326a1.75 1.75 0 0 1 1.622 1.093L5.065 6H20.25a.75.75 0 0 1 .7 1.018l-2.758 7.214A2.75 2.75 0 0 1 15.623 16H9.348A2.75 2.75 0 0 1 6.8 14.282L3.308 5.656a.25.25 0 0 0-.232-.156H1.75A.75.75 0 0 1 1 4.75ZM5.672 7.5l2.517 6.219c.191.472.65.781 1.16.781h6.274c.519 0 .983-.32 1.168-.804l2.37-6.196H5.671Z"
            clip-rule="evenodd"
          ></path>
          <path
            d="M8.5 17a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm9.5 1.5a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0Z"
          ></path>
        </svg>
      </button>
      <RouterLink to="/login" class="btn btn-soft">Connexion</RouterLink>
      <RouterLink to="/register" class="btn btn-primary">S'inscrire</RouterLink>
    </div>
  </header>
</template>
