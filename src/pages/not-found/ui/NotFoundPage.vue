<template>
  <section class="card app-card text-center">
    <p class="display-1 fw-bold text-primary mb-0">404</p>
    <h1 class="h4">Page not found</h1>
    <p class="text-body-secondary">The page you are looking for does not exist.</p>
    <div>
      <RouterLink class="btn btn-primary" :to="{ name: 'home' }">Go to home page</RouterLink>
    </div>
  </section>
</template>
