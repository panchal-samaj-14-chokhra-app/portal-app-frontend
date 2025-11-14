"use client";

import React from "react";

// UI Components
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Icons
import {
  Users,
  HeartPulse,
  GraduationCap,
  Briefcase,
  Landmark,
} from "lucide-react";

import ApexChart from "react-apexcharts";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { useStaticData } from "@/data-hooks/mutation-query/useQueryAndMutation";

const StatisticsView: React.FC = () => {
  const { data, isLoading } = useStaticData();

  if (isLoading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  const api = data?.data;

  // ===============================================
  // MAP API VALUES
  // ===============================================
  const stats = {
    male: api?.global?.gender?.male || 0,
    female: api?.global?.gender?.female || 0,
    other: api?.global?.gender?.other || 0,

    insured: api?.global?.health?.insured || 0,
    interested: api?.global?.health?.interested || 0,

    bankAccount: api?.global?.social?.bankAccount || 0,
    govBenefit: api?.global?.social?.govBenefit || 0,

    eduMale: api?.global?.education?.male || 0,
    eduFemale: api?.global?.education?.female || 0,
    eduOther: api?.global?.education?.other || 0,

    working: api?.global?.employment?.working || 0,
    notWorking: api?.global?.employment?.notWorking || 0,

    ageRange: api?.global?.ageRange || {},
  };

  // ===============================================
  // 1️⃣ Gender Donut Chart (Apex)
  // ===============================================
  const genderSeries = [stats.male, stats.female, stats.other];

  const genderOptions: ApexCharts.ApexOptions = {
    chart: { type: "donut" },
    labels: ["पुरुष", "महिला", "अन्य"],
    colors: ["#2563eb", "#db2777", "#7c3aed"],
    legend: { position: "bottom" },
    dataLabels: { enabled: true },
    responsive: [
      {
        breakpoint: 640,
        options: {
          chart: { width: "100%" },
          legend: { position: "bottom" },
        },
      },
    ],
  };

  // ===============================================
  // 2️⃣ Line Graph – Chokhla Male/Female Comparison
  // ===============================================
  const chokhlaGraphData =
    api?.chokhlaStats?.map((ch: any) => ({
      name: ch.chokhlaName,
      male: ch.gender.male,
      female: ch.gender.female,
    })) || [];

  const chokhlaOptions: ApexCharts.ApexOptions = {
    chart: { type: "line", toolbar: { show: false } },
    xaxis: { categories: chokhlaGraphData.map((d: any) => d.name) },
    colors: ["#2563eb", "#db2777"],
    stroke: { curve: "smooth", width: 3 },
    legend: { position: "top" },
  };

  const chokhlaSeries = [
    { name: "पुरुष", data: chokhlaGraphData.map((d: any) => d.male) },
    { name: "महिला", data: chokhlaGraphData.map((d: any) => d.female) },
  ];

  // ===============================================
  // RENDER
  // ===============================================
  return (
    <div className="w-full space-y-6">

      {/* =====================================================
          🌟 GENDER DONUT CARD (Modern + Icons + ApexChart)
      ====================================================== */}
      <Card className="bg-gradient-to-br from-orange-50 to-white shadow-lg border border-orange-200 rounded-2xl">
        <CardHeader className="pb-2">
          <div className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-orange-700" />
            <div>
              <CardTitle className="text-lg font-semibold text-orange-700">
                लिंग अनुपात
              </CardTitle>
              <CardDescription className="text-gray-600 text-sm">
                कुल सदस्यों का लिंग आधारित वितरण
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        {/* Donut Chart */}
        <CardContent className="pt-0">
          <div className="flex justify-center items-center w-full">
            <ApexChart
              type="donut"
              width="100%"
              height={300}
              options={genderOptions}
              series={genderSeries}
            />
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">

            {/* Male */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">पुरुष</p>
              <p className="text-2xl font-bold text-blue-600">{stats.male}</p>
            </div>

            {/* Female */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-pink-200 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-pink-600" />
              </div>
              <p className="text-sm text-gray-600">महिला</p>
              <p className="text-2xl font-bold text-pink-600">{stats.female}</p>
            </div>

            {/* Other */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-200 flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">अन्य</p>
              <p className="text-2xl font-bold text-purple-600">{stats.other}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* =====================================================
          AGE RANGE CARD
      ====================================================== */}
      <Card className="bg-white shadow-md border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700">
            <Users className="w-5 h-5 mr-2" />
            आयु वितरण
          </CardTitle>
          <CardDescription>
            सदस्यों की आयु सीमा के अनुसार संख्या
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3">
          {Object.entries(stats.ageRange).map(([range, total]: any) => (
            <div
              key={range}
              className="flex justify-between bg-orange-50 p-3 rounded-lg"
            >
              <span className="font-medium">{range}</span>
              <span className="font-bold text-orange-700">{total}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* =====================================================
          HEALTH / SOCIAL / EDUCATION / EMPLOYMENT CARDS
      ====================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* HEALTH */}
        <Card className="bg-white shadow-md border-green-200">
          <CardHeader>
            <CardTitle className="text-green-700 flex items-center">
              <HeartPulse className="w-5 h-5 mr-2" />
              स्वास्थ्य जानकारी
            </CardTitle>
            <CardDescription>बीमा और रुचि</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium">बीमित सदस्य</span>
              <span className="font-bold text-green-700">{stats.insured}</span>
            </div>

            <div className="flex justify-between p-3 bg-green-50 rounded-lg">
              <span className="font-medium">बीमा में रुचि</span>
              <span className="font-bold text-green-700">{stats.interested}</span>
            </div>
          </CardContent>
        </Card>

        {/* SOCIAL */}
        <Card className="bg-white shadow-md border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-700 flex items-center">
              <Landmark className="w-5 h-5 mr-2" />
              सामाजिक जानकारी
            </CardTitle>
            <CardDescription>बैंक एवं सरकारी लाभ</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">बैंक खाते</span>
              <span className="font-bold text-blue-700">{stats.bankAccount}</span>
            </div>

            <div className="flex justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">सरकारी लाभ</span>
              <span className="font-bold text-blue-700">{stats.govBenefit}</span>
            </div>
          </CardContent>
        </Card>

        {/* EDUCATION */}
        <Card className="bg-white shadow-md border-purple-200">
          <CardHeader>
            <CardTitle className="text-purple-700 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              शिक्षा स्तर
            </CardTitle>
            <CardDescription>शिक्षा अनुसार सदस्य</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
              <span className="font-medium">पुरुष</span>
              <span className="font-bold text-purple-700">{stats.eduMale}</span>
            </div>

            <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
              <span className="font-medium">महिला</span>
              <span className="font-bold text-purple-700">{stats.eduFemale}</span>
            </div>

            <div className="flex justify-between p-3 bg-purple-50 rounded-lg">
              <span className="font-medium">अन्य</span>
              <span className="font-bold text-purple-700">{stats.eduOther}</span>
            </div>
          </CardContent>
        </Card>

        {/* EMPLOYMENT */}
        <Card className="bg-white shadow-md border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-700 flex items-center">
              <Briefcase className="w-5 h-5 mr-2" />
              रोजगार स्थिति
            </CardTitle>
            <CardDescription>कार्यरत एवं बेरोजगार सदस्य</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
              <span className="font-medium">कार्यरत</span>
              <span className="font-bold text-orange-700">{stats.working}</span>
            </div>

            <div className="flex justify-between p-3 bg-orange-50 rounded-lg">
              <span className="font-medium">बेरोजगार</span>
              <span className="font-bold text-orange-700">{stats.notWorking}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* =====================================================
          LINE GRAPH: CHOKHLA MALE/FEMALE RATIO
      ====================================================== */}
      <Card className="bg-white shadow-md border-indigo-200">
        <CardHeader>
          <CardTitle className="text-indigo-700">
            चोखरा अनुसार पुरुष–महिला तुलना
          </CardTitle>
          <CardDescription>
            प्रत्येक चोखरा के पुरुष–महिला आँकड़ों का रुझान
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ApexChart
            type="line"
            height={350}
            options={chokhlaOptions}
            series={chokhlaSeries}
          />
        </CardContent>
      </Card>

      {/* =====================================================
          ACCORDION: CHOKHLA DETAILS
      ====================================================== */}
      <Card className="bg-white shadow-md border-orange-200">
        <CardHeader>
          <CardTitle className="text-orange-700">चोखरा आंकड़े</CardTitle>
          <CardDescription>प्रत्येक चोखरा का विस्तृत विवरण</CardDescription>
        </CardHeader>

        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {api?.chokhlaStats?.map((item: any) => (
              <AccordionItem key={item.chokhlaId} value={item.chokhlaId}>
                <AccordionTrigger className="text-lg font-semibold">
                  {item.chokhlaName} — (लिंग अनुपात: {item.genderRatio})
                </AccordionTrigger>

                <AccordionContent>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">पुरुष:</span>
                      <span className="text-gray-900">{item.gender.male}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">महिला:</span>
                      <span className="text-gray-900">{item.gender.female}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">अन्य:</span>
                      <span className="text-gray-900">{item.gender.other}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">बीमा प्राप्त:</span>
                      <span className="text-gray-900">{item.health.insured}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">रुचि:</span>
                      <span className="text-gray-900">{item.health.interested}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-medium text-gray-700">
                        बैंक खाते:
                      </span>
                      <span className="text-gray-900">
                        {item.social.bankAccount}
                      </span>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsView;
