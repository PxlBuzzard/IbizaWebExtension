<template>
    <section>
        <b-field>
            <b-radio-button v-model="radioButton"
                native-value="DF">
                DF
            </b-radio-button>

            <b-radio-button v-model="radioButton"
                native-value="RC">
                RC
            </b-radio-button>

            <b-radio-button v-model="radioButton"
                native-value="MPAC">
                MPAC
            </b-radio-button>

            <b-radio-button v-model="radioButton"
                native-value="Prod">
                Prod
            </b-radio-button>
        </b-field>
        <p class="content">
            <b>Selection:</b>
            {{ radioButton }}
        </p>
    </section>
</template>

<script lang="ts">
export default {
    name: "IbizaEnvSelector",
    data() {
        return {
            radioButton: ""
        }
    }
}
</script>

<style>

</style>
