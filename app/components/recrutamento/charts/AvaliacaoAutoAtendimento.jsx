import dynamic from 'next/dynamic'
import Loading from '@/components/Layouts/Loading'
import WarningMessage from '../../Layouts/WarningMessage'
const AnswersChart = dynamic(() => import('@/components/chart/AnswersChart'), {
    ssr: false,
})
import { empty } from '@/assets/utils'

const AvaliacaoAutoAtendimento = ({ chartData, chartId, isReady }) => {
    return (
        <>
            {!isReady ? (
                <Loading active={true} className='mt-8 relative' />
            ) : !empty(chartData) || Object.keys(chartData).length > 0 ? (
                <AnswersChart isReady={true} chartData={chartData} chartId={chartId} />
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

export default AvaliacaoAutoAtendimento
