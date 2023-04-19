<template>
  <p>{{ JSON.stringify(itinerary.pricingOptions[0]) }}</p>
</template>
<script>
// "9451-2308170845--32356,-30598-1-12387-2308171820": {
//                     "pricingOptions": [
//                         {
//                             "price": {
//                                 "amount": "406990",
//                                 "unit": "PRICE_UNIT_MILLI",
//                                 "updateStatus": "PRICE_UPDATE_STATUS_UNSPECIFIED"
//                             },
//                             "agentIds": [
//                                 "mtuk"
//                             ],
//                             "items": [
//                                 {
//                                     "price": {
//                                         "amount": "406990",
//                                         "unit": "PRICE_UNIT_MILLI",
//                                         "updateStatus": "PRICE_UPDATE_STATUS_UNSPECIFIED"
//                                     },
//                                     "agentId": "mtuk",
//                                     "deepLink": "https://skyscanner.pxf.io/c/2850210/1103265/13416?u=https%3A%2F%2Fwww.skyscanner.net%2Ftransport_deeplink%2F4.0%2FUK%2Fen-GB%2FGBP%2Fmtuk%2F1%2F9451.12387.2023-08-17%2Fair%2Ftrava%2Fflights%3Fitinerary%3Dflight%257C-32356%257C2512%257C9451%257C2023-08-17T08%253A45%257C13771%257C2023-08-17T08%253A55%257C70%257C-%257C-%257C-%253Bflight%257C-30598%257C740%257C13542%257C2023-08-17T15%253A00%257C12387%257C2023-08-17T18%253A20%257C500%257C-%257C-%257C-%26carriers%3D-32356%252C-30598%26operators%3D-32356%253B-30598%26passengers%3D1%26channel%3Ddataapi%26cabin_class%3Deconomy%26fps_session_id%3D4e8606ac-5d13-43e4-ae5a-e5fb7a913d8e%26ticket_price%3D406.99%26is_npt%3Dfalse%26is_multipart%3Dfalse%26client_id%3Dskyscanner_b2b%26request_id%3D14630429-0db8-4507-b0e4-5c00b6ba7642%26q_ids%3DH4sIAAAAAAAA_-OS4mLJLSnNFmLmeO0pxcwx0VGh4djXZWxGTAqMABwqNqEcAAAA%257C-7831680394537023591%257C2%26q_sources%3DJACQUARD%26commercial_filters%3Dfalse%26q_datetime_utc%3D2023-04-19T18%253A14%253A21%26transfer_protection%3Dprotected%26pqid%3Dtrue%26api_logo%3Dhttps%253A%252F%252Flogos.skyscnr.com%252Fimages%252Fpartners%252Fdefault.png%26api_pbs%3Dtrue%26associate_id%3DAFF_TRA_19354_00001%26app_id%3DG4IcGcdmVpjw77HZ3bCQanBnLBKNE76h2RC%25252Bq0zWNAx4vlSXpxjay009pDhvp9R8&associateid=AFF_TRA_19354_00001",
//                                     "fares": [
//                                         {
//                                             "segmentId": "9451-13771-2308170845-2308170855--32356",
//                                             "bookingCode": "",
//                                             "fareBasisCode": ""
//                                         },
//                                         {
//                                             "segmentId": "13542-12387-2308171500-2308171820--30598",
//                                             "bookingCode": "",
//                                             "fareBasisCode": ""
//                                         }
//                                     ]
//                                 }
//                             ],
//                             "transferType": "TRANSFER_TYPE_PROTECTED_SELF_TRANSFER",
//                             "id": "FeAyxWQqvbEI"
//                         }
//                     ],
//                     "legIds": [
//                         "9451-2308170845--32356,-30598-1-12387-2308171820"
//                     ],
//                     "sustainabilityData": null
//                 },
import store from "./../store";
export default {
  name: "FlightComponent",
  props: {
    itinerary: Object,
  },
  computed: {
    currency() {
      return store.state.currency;
    },
  },
};
</script>
