from sqlalchemy import BigInteger, Numeric, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.database.base import Base

class Prediction(Base):
    __tablename__ = "predictions"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    component_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("components.id", ondelete="CASCADE"),
        nullable=False
    )

    anomaly_score: Mapped[float] = mapped_column(
        Numeric(10, 6),
        nullable=False
    )

    risk_level: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )

    prediction: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )

    value_0h: Mapped[float | None] = mapped_column(Numeric(10, 3))
    value_24h: Mapped[float | None] = mapped_column(Numeric(10, 3))
    predicted_168h: Mapped[float | None] = mapped_column(Numeric(10, 3))
    drift_rate: Mapped[float | None] = mapped_column(Numeric(10, 6))
    safety_slope: Mapped[float | None] = mapped_column(Numeric(10, 6))

    explanation: Mapped[str | None] = mapped_column(Text)

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )