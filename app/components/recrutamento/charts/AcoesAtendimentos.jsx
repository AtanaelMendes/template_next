import dynamic from 'next/dynamic'
import { empty } from '@/assets/utils'
import Loading from '@/components/Layouts/Loading'
import WarningMessage from '../../Layouts/WarningMessage'
const MultiAxisLineChart = dynamic(
    () => import('@/components/chart/MultiAxisLineChart'),
    { ssr: false }
);


const AcoesAtendimentos = ({ chartData, nmChart, isReady }) => {
    return (
        <>
            {!isReady ? (
                <Loading active={true} className='mt-8 relative' />
            ) : !empty(chartData) || Object.keys(chartData).length > 0 ? (
                <MultiAxisLineChart seriesConfigs={chartData} nmChart={nmChart} useSharedYAxis={true} />
            ) : (
                <div className='m-8'>
                    <WarningMessage
                        subTitle={"Nenhum registro encontrado para o período selecionado!"}
                    />
                </div>
            )}
        </>
    )
}

export default AcoesAtendimentos
