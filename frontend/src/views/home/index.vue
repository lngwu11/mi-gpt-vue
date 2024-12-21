<template>
  <div class="migpt-home">
    <div class="background-animation"></div>
    <header>
      <div class="logo">
        <span class="logo-text">Mi</span>
        <div class="logo-circle"></div>
        <span class="logo-text">GPT</span>
      </div>
      <nav>
       <router-link to="/config" class="nav-link">
       <i class="fas fa-sliders-h"></i>
        配置中心
      </router-link>
      </nav>
    </header>
    <main>
      <section class="hero">
        <h1 class="title-home">欢迎使用 MiGPT</h1>
        <p class="subtitle">您的智能家居，进化升级</p>
        <div class="hero-image">
          <img src="../../assets/images/ait.png" alt="AI驱动的智能家居" loading="eager" decoding="async" />
        </div>
      </section>
      
      <section class="introduction">
        <h2>重新定义智能家居</h2>
        <p>在这个数字化的世界里，家已不仅仅是一个居住的地方，而是我们数字生活的延伸。MiGPT 通过将小爱音箱、米家智能设备与 ChatGPT 的理解能力完美融合，打造出真正懂你的智能家居。</p>
      </section>
      
      <section class="features">
        <h2>核心功能</h2>
        <div class="feature-grid">
          <div v-for="feature in features" :key="feature.title" class="feature-card">
            <i :class="feature.icon"></i>
            <h3>{{ feature.title }}</h3>
            <p>{{ feature.description }}</p>
          </div>
        </div>
      </section>
      
      <section class="vision">
        <h2>我们的愿景</h2>
        <p>MiGPT 不仅仅是关于设备自动化，而是关于打造一个懂你、有温度、与你共同进化的家。想象一下，未来你的每个智能家居设备，从灯泡、插座，到扫地机器人、电视等，都可以作为一个个独立的智能体，更智能、更贴心地响应你的指令。</p>
        <p>这些独立的智能体可以彼此感知，彼此配合，构成一个更强大的协作网络。而小爱音箱就像是你的智能家居专属管家，全心全意为你服务，释放智能家居的真正潜力。</p>
      </section>
    </main>
    <footer>
      <p>&copy; 2024 MiGPT. 赋能您的智能家居。</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  data() {
    return {
      features: [
        { icon: 'fas fa-graduation-cap', title: 'AI 问答', description: '将您的小爱音箱转变为知识渊博的助手，获取海量信息。' },
        { icon: 'fas fa-theater-masks', title: '角色扮演', description: '一秒调教小爱，成为您的完美伴侣或倾听心事的贴心闺蜜。' },
        { icon: 'fas fa-comments', title: '流式响应', description: '体验与 AI 助手即时、流畅的对话交流。' },
        { icon: 'fas fa-brain', title: '长短期记忆', description: '小爱音箱记住您们之间的每一次对话，越聊越默契。' },
        { icon: 'fas fa-microphone-alt', title: '自定义 TTS', description: '使用"豆包"同款音色个性化您的 AI 声音，使交互更加自然。' },
      ]
    }
  }
}
</script>

<style scoped>
@import './home.css';
</style>

