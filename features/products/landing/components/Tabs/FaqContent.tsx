import React from "react";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

type FaqItem = {
    question: string;
    answer: string;
};

const faqsData: FaqItem[] = [
    {
        question: "Apa bahan dari kaos ini?",
        answer:
            "Berikan detail tentang jenis kain (misalnya katun, poliester, campuran), berat, dan fitur khusus apa pun.",
    },
    {
        question: "Apa petunjuk perawatan untuk kaos ini?",
        answer:
            "Jelaskan metode pencucian, pengeringan, dan setrika yang direkomendasikan untuk menjaga kualitas dan daya tahan.",
    },
    {
        question: "Apa desain atau cetakan pada kaos ini terbuat dari?",
        answer:
            "Jelaskan bahan yang digunakan untuk desain (misalnya vinil, sablon, bordir) dan daya tahannya.",
    },
    {
        question: "Apakah kaos ini unisex atau dirancang untuk gender tertentu?",
        answer:
            "Indikasikan apakah baju ini cocok untuk pria dan wanita atau ditujukan untuk gender tertentu.",
    },
    {
        question: "Apa opsi pengiriman dan biayanya?",
        answer:
            "Berikan informasi tentang metode pengiriman, estimasi waktu pengiriman, dan biaya terkait.",
    },
    {
        question: "Apa kebijakan pengembalian untuk kaos ini?",
        answer:
            "Jelaskan jangka waktu pengembalian, kondisi, dan prosedur pengembalian uang atau penukaran.",
    },
];

const FaqContent = () => {
    return (
        <section>
            <h3 className="text-xl sm:text-2xl font-bold text-black mb-5 sm:mb-6">
                Pertanyaan yang Sering Diajukan
            </h3>
            <Accordion type="single" collapsible>
                {faqsData.map((faq, idx) => (
                    <AccordionItem key={idx} value={`item-${idx + 1}`}>
                        <AccordionTrigger className="text-left">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent>{faq.answer}</AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
};

export default FaqContent;