import {
  useEffect,
  useRef,
} from "react";

import * as echarts from "echarts";


function BurnInChart({
  readings = [],
  liveReadings = [],
}) {

  const chartRef =
    useRef(null);


  useEffect(() => {

    if (!chartRef.current) {
      return;
    }


    const chart =
      echarts.init(
        chartRef.current
      );


    const liveData =
      liveReadings.length > 0
        ? liveReadings
        : [];


    let xAxisData = [];
    let temperatureData = [];
    let voltageData = [];
    let currentData = [];
    let powerData = [];
    let leakageData = [];


    /*
    ==================================================
    LIVE DATA
    ==================================================
    */

    if (
      liveData.length > 0
    ) {

      xAxisData =
        liveData.map(
          (item, index) =>
            `${item.burn_in_hours ?? index}h`
        );


      temperatureData =
        liveData.map(
          (item) =>
            Number(
              item.temperature ?? 0
            )
        );


      voltageData =
        liveData.map(
          (item) =>
            Number(
              item.voltage ?? 0
            )
        );


      currentData =
        liveData.map(
          (item) =>
            Number(
              item.current ?? 0
            )
        );


      powerData =
        liveData.map(
          (item) =>
            Number(
              item.power ?? 0
            )
        );


      leakageData =
        liveData.map(
          (item) =>
            Number(
              item.leakage_current ?? 0
            )
        );

    }


    /*
    ==================================================
    STORED DATA
    ==================================================
    */

    else {

      const fallback =
        readings.slice(-10);


      xAxisData =
        fallback.map(
          (item, index) =>
            `${item.burn_in_hours ?? index}h`
        );


      temperatureData =
        fallback.map(
          (item) =>
            Number(
              item.temperature ?? 0
            )
        );


      voltageData =
        fallback.map(
          (item) =>
            Number(
              item.voltage ?? 0
            )
        );


      currentData =
        fallback.map(
          (item) =>
            Number(
              item.current ?? 0
            )
        );


      powerData =
        fallback.map(
          (item) =>
            Number(
              item.power ?? 0
            )
        );


      leakageData =
        fallback.map(
          (item) =>
            Number(
              item.leakage_current ?? 0
            )
        );

    }


    /*
    ==================================================
    ECHARTS
    ==================================================
    */

    const option = {

      animation: true,

      tooltip: {
        trigger: "axis",
      },


      legend: {

        top: 0,

        textStyle: {
          color: "#94a3b8",
        },

      },


      grid: {

        left: "5%",

        right: "4%",

        top: "18%",

        bottom: "15%",

        containLabel: true,

      },


      xAxis: {

        type: "category",

        data:
          xAxisData,

        axisLine: {

          lineStyle: {
            color: "#64748b",
          },

        },


        axisLabel: {

          color:
            "#94a3b8",

        },

      },


      yAxis: {

        type: "value",

        axisLabel: {

          color:
            "#94a3b8",

        },


        splitLine: {

          lineStyle: {

            color:
              "#1e293b",

          },

        },

      },


      series: [

        {

          name:
            "Temperature",

          type:
            "line",

          data:
            temperatureData,

          smooth:
            true,

          symbol:
            "circle",

          symbolSize:
            6,

        },


        {

          name:
            "Voltage",

          type:
            "line",

          data:
            voltageData,

          smooth:
            true,

          symbol:
            "circle",

          symbolSize:
            6,

        },


        {

          name:
            "Current",

          type:
            "line",

          data:
            currentData,

          smooth:
            true,

          symbol:
            "circle",

          symbolSize:
            6,

        },


        {

          name:
            "Power",

          type:
            "line",

          data:
            powerData,

          smooth:
            true,

          symbol:
            "circle",

          symbolSize:
            6,

        },


        {

          name:
            "Leakage",

          type:
            "line",

          data:
            leakageData,

          smooth:
            true,

          symbol:
            "circle",

          symbolSize:
            6,

        },

      ],

    };


    chart.setOption(
      option
    );


    const handleResize =
      () => {

        chart.resize();

      };


    window.addEventListener(
      "resize",
      handleResize
    );


    return () => {

      window.removeEventListener(
        "resize",
        handleResize
      );


      chart.dispose();

    };

  }, [
    readings,
    liveReadings,
  ]);


  return (

    <div
      ref={chartRef}

      style={{
        width:
          "100%",

        height:
          "350px",
      }}
    />

  );

}


export default BurnInChart;