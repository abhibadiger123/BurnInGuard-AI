from sqlalchemy import BigInteger, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime
from app.database.base import Base

class BurnInReading(Base):
    __tablename__ = "burn_in_readings"

    id: Mapped[int] = mapped_column(BigInteger, primary_key=True, autoincrement=True)

    component_id: Mapped[int] = mapped_column(
        BigInteger,
        ForeignKey("components.id", ondelete="CASCADE"),
        nullable=False
    )

    temperature: Mapped[float] = mapped_column(Numeric(10, 3), nullable=False)
    voltage: Mapped[float] = mapped_column(Numeric(10, 3), nullable=False)
    current: Mapped[float] = mapped_column(Numeric(10, 3), nullable=False)
    power: Mapped[float] = mapped_column(Numeric(10, 3), nullable=False)

    leakage_current: Mapped[float | None] = mapped_column(Numeric(10, 3))

    value_0h: Mapped[float | None] = mapped_column(Numeric(10, 3))
    value_24h: Mapped[float | None] = mapped_column(Numeric(10, 3))
    value_168h: Mapped[float | None] = mapped_column(Numeric(10, 3))

    burn_in_hours: Mapped[float] = mapped_column(
        Numeric(10, 3),
        default=0
    )

    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )