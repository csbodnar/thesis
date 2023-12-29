<template>
  <div>
    <div>{{ date }}</div>
    <div v-if="year !== currentYear">{{ year }}</div>
    <div>{{ time }}</div>
  </div>
</template>
<script>
export default {
  name: "FormattedDate",
  props: {
    dateObj: {
      type: Date,
      required: true,
    },
  },
  computed: {
    date() {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${months[this.dateObj.getMonth()]} ${this.dateObj.getDate()}`;
    },
    year() {
      return this.dateObj.getFullYear();
    },
    currentYear() {
      return new Date().getFullYear();
    },
    time() {
      const hours = ("0" + this.dateObj.getHours()).slice(-2);
      const minutes = ("0" + this.dateObj.getMinutes()).slice(-2);
      return `${hours}:${minutes}`;
    },
  },
};
</script>
