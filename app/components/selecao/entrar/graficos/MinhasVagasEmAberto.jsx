import dynamic from "next/dynamic";
import { useState, useEffect, useMemo } from "react";
import { useAppContext } from "@/context/AppContext";
import Loading from "@/components/Layouts/Loading";
import axiosInstance from "@/plugins/axios";
import PillsBadge from "@/components/buttons/PillsBadge";
import { cn, empty } from "@/assets/utils";

const XyVerticalChart = dynamic(() => import("@/components/chart/XyVerticalChart"), { ssr: false });

function MinhasVagasEmAberto({ active, cdPessoaSelecionador, cdUnidade, ...props }) {
    const { toast, user } = useAppContext();
    const [totalData, setTotalData] = useState([]);
    const [ready, setReady] = useState(false);
    const colorList = ["#FFD248", "#fc6868", "#fc0505"];

    function getJobOppeningsData() {
        const params = { cd_pessoa_selecionador: cdPessoaSelecionador };
        setReady(false);
        axiosInstance
            .get(`vaga/vagas-abertas-selecionador/${cdUnidade}`, { params })
            .then((response) => {
                setReady(true);
                if (response.status === 200) {
                    setTotalData(response.data);
                }
            })
            .catch(function (error) {
                setReady(false);
                toast.error("Não foi possível buscar dados das suas Vagas Abertas");
                console.error(error);
            });
    }

    useEffect(() => {
        if (empty(cdUnidade)) return;
        getJobOppeningsData();
    }, [cdUnidade, cdPessoaSelecionador]);


    const chartData = useMemo(
        () =>
            !empty(totalData)
                ? [
                    {
                        name: "",
                        label: "0 a 5 dias",
                        value: totalData.nrVagasCincoDias,
                    },
                    {
                        name: "",
                        label: "6 a 12 dias",
                        value: totalData.nrVagasDozeDias,
                    },
                    {
                        name: "",
                        label: "12 a 30 dias",
                        value: totalData.nrVagasMaisDias,
                    }
                ]
                : [],
        [totalData]
    );

    return (
        <>
            {ready ? (
                <>
                    <XyVerticalChart nmChart={"minhasvagasemaberto"} chartData={chartData} />
                    <div className="flex flex-row gap-6 justify-center">
                        {chartData.map((item, index) => (
                            <div className="flex flex-row gap-1 items-center" key={index}>
                                <PillsBadge
                                    type={"default"}
                                    className={cn(
                                        `rounded`,
                                        index === 0 && "bg-[#ffd248]",
                                        index === 1 && "bg-[#fc6868]",
                                        index === 2 && "text-white bg-[#fc0505]",
                                        "text-xs"
                                    )}
                                >
                                    {item.label}
                                </PillsBadge>
                                <span className="text-sm font-medium">{item.value} vaga(s)</span>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <Loading active={!ready} className={"mt-20 relative"} />
            )}
        </>
    );
}

export default MinhasVagasEmAberto;
