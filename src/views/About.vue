<template>
  <div class="about">
    <div class="Title">
      <h1 style="text-align: center; font-size: 150%; font-family: Times, serif">
        AcademicDealer: An Integrated Platform for Academic Acitivities
      </h1>
    </div>
    <div class="Author">
      <p style="text-align: center; font-family: Times, serif">
        <strong>
        Zhuo Cheng, Hao He, Yuxi Liu, Zhiyao Ma, Ziqi Pang, Pai Tong, Jiashu Wang, Hang Yin
        </strong>
      </p>
      <p style="text-align: center; font-family: Times, serif">
        <strong>
        Peking University
        </strong>
      </p>
    </div>
    <el-container>
      <el-header> <b> What is AcademicDealer </b> </el-header>
      <el-main style = "text-align = left;
                 font-size: 150%;
                 font-family: Times, serif;
                 line-height: 40px;
                 margin: auto;
                 background-color: #EBEEF5"> AcademicDealer is an integrated platform designed for the researchers in universities.
        It publishes information about the research groups, seminars and on-going research projects.
        At the same time, it also offers the chance for researchers to initiate their own seminars and projects, encouraging the cooperation and communication of people.
        With AcademicDealer proudly presented, we hope it provide pertinent assistance for the people contributing their strength in advancing human civilization.
        As it goes, everyone can proceed a single step leaping the development of the whole mankind.
        <el-image
          :src="require('../assets/img/about-structure.jpg')"
          :fit="fit">
        </el-image> </el-main>
    </el-container>
    <el-container>
      <el-header> <b> Who are we </b> </el-header>
      <el-main style = "text-align = left;
                 font-size: 150%;
                 font-family: Times, serif;
                 line-height: 40px;
                 margin: auto;
                 background-color: #EBEEF5"> We are a group of students from Peking University, majoring in computer science and bearing the same dream of making contrinution to this world with our skills.
        More or less, the objective has been accomplished.
        Below, we have a perfunctory family photo.
        <el-image
          :src="require('../assets/img/perfunctory-group-photo.jpg')"
          :fit="fit">
        </el-image> </el-main>
    </el-container>
  </div>
</template>

<style scoped>
  .el-header {
    background-color: #C0C4CC;
    margin: auto;
    text-align: center;
    font-family: Times, serif;
    font-size: 150%;
    line-height: 60px
  }
</style>
